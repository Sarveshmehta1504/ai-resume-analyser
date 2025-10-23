import React from 'react'
import ScoreCircle from './ScoreCircle'

interface SummaryProps {
  feedback: Feedback
}

const Summary = ({ feedback }: SummaryProps) => {
  return (
    <div className='flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm'>
      <h3 className='text-2xl font-bold text-gray-800'>Overall Summary</h3>
      <div className='flex items-center justify-center gap-8'>
        <ScoreCircle score={feedback.overallScore} />
        <div className='flex-1'>
          <p className='text-lg text-gray-600'>
            Your resume scored <span className='font-bold text-gray-800'>{feedback.overallScore}/100</span>
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            Based on ATS compatibility, content quality, structure, tone, and skills alignment.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Summary