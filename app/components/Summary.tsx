import React from 'react'
import ScoreCircle from './ScoreCircle'
import ScoreGauge from './ScoreGauge'

interface SummaryProps {
  feedback: Feedback
}

const Summary = ({ feedback }: {feedback: Feedback}) => {
  return (
    <div className='bg-white rounded-2xl shadow-md w-full'>
        <div className='flex flex-row items-center p-4 gap-8'>
            <ScoreGauge score={feedback.overallScore}/>
            <div className="flex flex-col gap-2">
                <h2 className='text-2xl font-bold'>Your Resume Score</h2>
                <p className='text-sm text-gray-500'>This score is calculated based on the variable listed below</p>
            </div>
        </div>
    </div>
  )
}

export default Summary