import React, { useState, type FormEvent } from 'react'
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'

const upload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setfile] = useState<File | null>(null)
  const HandleFileSelect = (file: File | null) => {
      setfile(file);
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if(!form) return;
    const formData = new FormData(form);
    const companyName = formData.get('company-name');
    const jobTitle = formData.get('job-title');
    const jobDesc = formData.get('job-desc');

    console.log({companyName, jobTitle, jobDesc, file});
  }
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
        <section className="main-section">
            <div className='page-heading py-16'>
                <h1>Get AI-powered feedback on your resume</h1>
                {isProcessing ? (
                  <>
                    <h2>{statusText}</h2>
                    <img src="/images/resume-scan.gif" className='w-full' alt="" />
                  </>
                ): (
                    <h2>Drop your resume for the ATS and the resume Tips.</h2>
                )}
                {!isProcessing && (
                  <form 
                    id="upload-form"
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-4 mt-8'>
                      <div className='form-div'>
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" placeholder="Company Name" name="company-name" />
                      </div>
                      <div className='form-div'>
                        <label htmlFor="job-title">Job Title</label>
                        <input type="text" placeholder="Job Title" name="job-title" />
                      </div>
                      <div className='form-div'>
                        <label htmlFor="job-desc">Job Description</label>
                        <textarea rows={5} placeholder="Job Description" name="job-desc" />
                      </div>
                      <div className='form-div'>
                        <label htmlFor="uploader">Upload Resume</label>
                        <FileUploader onFileSelect={HandleFileSelect}/>
                      </div>
                      <button className='primary-button' type='submit'>
                        Analyze Resume
                      </button>
                    </form>

                )}
            </div>
        </section>
    </main>
  )
}

export default upload