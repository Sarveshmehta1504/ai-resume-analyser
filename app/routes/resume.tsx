import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router';
import ATS from '~/components/ATS';
import Details from '~/components/Details';
import Summary from '~/components/Summary';
import { usePuterStore } from '~/lib/puter';

export const meta = () =>([
  {title: 'ResumeFeed | Review'},
  {name: 'description', content: 'Detailed overview of your resume'},
])
   

const resume = () => {
  const {auth,fs,kv, isLoading} = usePuterStore();
  const {id} = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback| null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  // Handle authentication check
  useEffect(() => {
    if(!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, id, navigate]);

  // Load resume data
  useEffect(() => {
    if (!id || !kv || !fs) return; // Don't run if dependencies not ready

    const loadResume = async () => {
      try {
        setDataLoading(true);
        console.log('Loading resume with id:', id);
        const resume  = await kv.get(`resume:${id}`);
        
        if(!resume) {
          console.error('No resume found for id:', id);
          setDataLoading(false);
          return;
        }
        
        const data = JSON.parse(resume as string);
        console.log('Resume data loaded:', data);
        
        // Load PDF
        const resumeblob = await fs.read(data.resumePath);
        if(!resumeblob) {
          console.error('Failed to load resume file');
          setDataLoading(false);
          return;
        }

        const pdfBlob = new Blob([resumeblob],{type: 'application/pdf'});
        const resumeUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(resumeUrl);
        console.log('Resume URL created:', resumeUrl);

        // Load Image
        const imageblob = await fs.read(data.imagePath);
        if(!imageblob) {
          console.error('Failed to load image file');
          setDataLoading(false);
          return;
        }
        
        const imageUrl = URL.createObjectURL(imageblob);
        setImageUrl(imageUrl);
        console.log('Image URL created:', imageUrl);

        // Parse feedback if it's a string (handles both string and object formats)
        try {
          if (typeof data.feedback === 'string') {
            setFeedback(JSON.parse(data.feedback));
            console.log('Feedback parsed from string:', data.feedback);
          } else {
            setFeedback(data.feedback);
            console.log('Feedback loaded as object:', data.feedback);
          }
        } catch (feedbackError) {
          console.error('Error parsing feedback:', feedbackError);
          // Set empty feedback structure
          setFeedback({
            overallScore: 50,
            ATS: { score: 50, tips: [{ type: "improve" as const, tip: "Error loading feedback" }] },
            toneAndStyle: { score: 50, tips: [{ type: "improve" as const, tip: "Error", explanation: "Error loading feedback" }] },
            content: { score: 50, tips: [{ type: "improve" as const, tip: "Error", explanation: "Error loading feedback" }] },
            structure: { score: 50, tips: [{ type: "improve" as const, tip: "Error", explanation: "Error loading feedback" }] },
            skills: { score: 50, tips: [{ type: "improve" as const, tip: "Error", explanation: "Error loading feedback" }] }
          });
        }
        setDataLoading(false);
      } catch (error) {
        console.error('Error loading resume:', error);
        setDataLoading(false);
      }
    }
    
    loadResume();
  }, [id, kv, fs]);
  return (
    <main className='!pt-0'>
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" 
          className='w-2.5 h-2.5'/>
          <span className='text-gray-800 text-sm font-semibold'>
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className='flex flex-row w-full max-lg:flex-col-reverse'>
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {dataLoading ? (
            <div className='animate-in fade-in duration-1000 flex items-center justify-center h-full'>
              <img src="/images/resume-scan-2.gif" className="w-1/2" alt="Loading..." />
            </div>
          ) : imageUrl && resumeUrl ? (
            <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit'>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img 
                  src={imageUrl} 
                  className='w-full h-full object-contain rounded-2xl'
                  alt="resume"
                   />
              </a>

            </div>
          ) : null}
        </section>
        <section className='feedback-section'>
          <h2 className='text-4xl !text-black font-bold'>Resume Review</h2>
          {
            dataLoading ? (
              <img src="/images/resume-scan-2.gif" className="w-full" alt="Loading..." />
            ) : feedback ? (
              <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
                <Summary feedback={feedback}/>
                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                <Details feedback={feedback}/>
              </div>
            ) : (
              <img src="/images/resume-scan-2.gif" className="w-full" alt="" />
            )
          }
        </section>

      </div>
    </main>
  )
}

export default resume