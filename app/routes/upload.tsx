import {type FormEvent, useState, useEffect} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    // Check authentication status
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate('/auth?next=/upload');
        }
    }, [auth.isAuthenticated, isLoading, navigate]);

    // Debug function to test AI availability
    const testAI = async () => {
        console.log('Testing AI service...');
        setStatusText('Testing AI connection...');
        
        try {
            // Check auth status first
            console.log('Auth status:', auth);
            console.log('User:', auth.user);
            
            // Test simple chat first
            console.log('Testing simple chat...');
            const testResult = await ai.chat("Hello, please respond with 'AI is working'");
            console.log('AI Test Result:', testResult);
            setStatusText('AI test successful!');
        } catch (error: any) {
            console.error('AI Test Failed:', error);
            setStatusText(`AI test failed: ${error.message || error.error || JSON.stringify(error)}`);
        }
    };

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        try {
            setIsProcessing(true);

            setStatusText('Uploading the file...');
            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) {
                setStatusText('Error: Failed to upload file');
                setIsProcessing(false);
                return;
            }

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            if(!imageFile.file) {
                setStatusText('Error: Failed to convert PDF to image');
                setIsProcessing(false);
                return;
            }

            setStatusText('Uploading the image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) {
                setStatusText('Error: Failed to upload image');
                setIsProcessing(false);
                return;
            }

            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                feedback: '',
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analyzing with AI...');

            const instructions = prepareInstructions({ jobTitle, jobDescription });
            console.log('AI Instructions:', instructions);
            console.log('File path:', uploadedFile.path);

            const feedback = await ai.feedback(
                uploadedFile.path,
                instructions
            )
            
            if (!feedback) {
                setStatusText('Error: AI service is currently unavailable. Please try again later.');
                setIsProcessing(false);
                return;
            }

            try {
                const feedbackText = typeof feedback.message.content === 'string'
                    ? feedback.message.content
                    : feedback.message.content[0].text;

                data.feedback = JSON.parse(feedbackText);
                await kv.set(`resume:${uuid}`, JSON.stringify(data));
                setStatusText('Analysis complete! Redirecting...');
                console.log(data);
                
                
            } catch (parseError) {
                console.error('Failed to parse AI response:', parseError, feedback);
                setStatusText('Error: Invalid AI response. Please try again.');
                setIsProcessing(false);
            }
            
        } catch (error: any) {
            console.error('Analysis error:', error);
            setStatusText(`Error: ${error.message || 'An unexpected error occurred. Please try again.'}`);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        
        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string || '';
        const jobTitle = formData.get('job-title') as string || '';
        const jobDescription = formData.get('job-description') as string || '';

        // Validation
        if(!file) {
            setStatusText('Please select a PDF file to upload');
            return;
        }
        
        if (!jobTitle.trim()) {
            setStatusText('Please enter a job title');
            return;
        }
        
        // Check authentication
        if (!auth.isAuthenticated) {
            navigate('/auth?next=/upload');
            return;
        }

        setStatusText('');
        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" alt="Processing..." />
                        </>
                    ) : (
                        <>
                            <h2>Drop your resume for an ATS score and improvement tips</h2>
                            {statusText && (
                                <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
                                    <p className="text-red-700">{statusText}</p>
                                </div>
                            )}
                        </>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                            
                            {/* Debug button - remove in production */}
                            <button 
                                type="button" 
                                onClick={testAI}
                                className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                            >
                                Test AI Connection
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload