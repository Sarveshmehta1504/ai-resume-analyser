import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import {resumes} from "constants/index"
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeFEED" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { auth,kv } = usePuterStore();
  const navigate = useNavigate();
  const [Resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResume, setloadingResume] = useState(false);


  useEffect(() => {
      if(!auth.isAuthenticated) navigate('/auth?next=/');
  },[auth.isAuthenticated])

  useEffect(() => {
    const loadResume = async() => {
      setloadingResume(true);
      const resumes = (await kv.list('resumes:*', true))as KVItem[];
      const parsedResume = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))
      console.log("parsedResumes", parsedResume);
      setResumes(parsedResume || []);
      setloadingResume(false);
    }
    loadResume();
  }, [])
  
    
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track You Resume Application</h1>
        {!loadingResume && resumes?.length===0 ? (
          <h2>No Resume Found. Upload your Resume</h2>

        ): (
          <h2>Review you resume and get AI-powred Feedback</h2>

        )}
      </div>
      {loadingResume && (
        <div className="flex flex-col items-center justify-center">
          <img src="/images/resume-scan-2.gif" alt="w-[200px]" />
        </div>
      )}
      {!loadingResume &&   resumes.length>0 && (
          <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume}/>
          ))}
        </div>
      )}
    {!loadingResume && resumes?.length=== 0 && (
      <div className="flex flex-col items-center justify-center mt-10 gap-4">
        <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
          Upload Resume
        </Link>
      </div>
    )}
    </section>
  </main>
}
