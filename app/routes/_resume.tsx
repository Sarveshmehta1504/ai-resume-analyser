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
   
const Resume = () => {
  const {auth, fs, kv, isLoading} = usePuterStore();
  const {id} = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  // Handle authentication check
  useEffect(() => {
    if(!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading]);

  // Load resume data
  useEffect(() => {
    const loadResume = async () => {
      try {
        setDataLoading(true);
        const resume = await kv.get(`resume:${id}`);
        
        if(!resume) {
          console.error('No resume found for id:', id);
          setDataLoading(false);
          return;
        }
        
        const data = JSON.parse(resume as string);
        
        // Load PDF
        const resumeBlob = await fs.read(data.resumePath);
        if(!resumeBlob) {
          console.error('Failed to load resume file');
          setDataLoading(false);
          return;
        }

        const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
        const resumeUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(resumeUrl);

        // Load Image
        const imageBlob = await fs.read(data.imagePath);
        if(!imageBlob) {
          console.error('Failed to load image file');
          setDataLoading(false);
          return;
        }
        
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);

        // Parse feedback if it's a string
        if (typeof data.feedback === 'string') {
          try {
            setFeedback(JSON.parse(data.feedback));
          } catch (error) {
            console.error('Error parsing feedback string:', error);
            setFeedback(null);
          }
        } else {
          setFeedback(data.feedback);
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
                <ATS score={feedback.ATS.score || 0} suggestion={feedback.ATS.tips || []}/>
                <Details feedback={feedback}/>
              </div>
            ) : (
              <img src="/images/resume-scan-2.gif" className="w-full" alt="Loading..." />
            )
          }
        </section>
      </div>
    </main>
  )
}

export default Resume
