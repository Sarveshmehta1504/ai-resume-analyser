import React from 'react'

interface ATSProps {
  score: number
  suggestion: { type: "good" | "improve"; tip: string }[]
}

const ATS = ({ score, suggestion }: ATSProps) => {
  const getScoreBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-badge-green text-badge-green-text', label: 'Excellent', icon: '/icons/ats-good.svg' }
    if (score >= 60) return { color: 'bg-badge-yellow text-badge-yellow-text', label: 'Good', icon: '/icons/ats-warning.svg' }
    return { color: 'bg-badge-red text-badge-red-text', label: 'Needs Work', icon: '/icons/ats-bad.svg' }
  }

  const badge = getScoreBadge(score)

  return (
    <div className='flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm'>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-bold text-gray-800'>ATS Compatibility</h3>
        <div className={`score-badge ${badge.color}`}>
          <img src={badge.icon} alt={badge.label} className='w-5 h-5' />
          <span className='font-semibold'>{score}/100</span>
        </div>
      </div>
      
      <div className='flex flex-col gap-3 mt-2'>
        {suggestion.map((tip, index) => (
          <div key={index} className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
            <img 
              src={tip.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'} 
              alt={tip.type} 
              className='w-5 h-5 mt-0.5'
            />
            <p className='text-sm text-gray-700'>{tip.tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ATS