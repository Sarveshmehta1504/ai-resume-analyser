import React, { useState } from 'react'

interface DetailsProps {
  feedback: Feedback
}

const Details = ({ feedback }: DetailsProps) => {
  const [activeTab, setActiveTab] = useState<'toneAndStyle' | 'content' | 'structure' | 'skills'>('content')

  const tabs = [
    { key: 'content' as const, label: 'Content', data: feedback.content },
    { key: 'structure' as const, label: 'Structure', data: feedback.structure },
    { key: 'toneAndStyle' as const, label: 'Tone & Style', data: feedback.toneAndStyle },
    { key: 'skills' as const, label: 'Skills', data: feedback.skills },
  ]

  const activeData = tabs.find(tab => tab.key === activeTab)?.data

  return (
    <div className='flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm'>
      <h3 className='text-2xl font-bold text-gray-800'>Detailed Feedback</h3>
      
      {/* Tabs */}
      <div className='flex gap-2 border-b border-gray-200 overflow-x-auto'>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeData && (
        <div className='flex flex-col gap-4 mt-2'>
          <div className='flex items-center gap-3'>
            <span className='text-3xl font-bold text-gray-800'>{activeData.score}/100</span>
            <div className='h-2 flex-1 bg-gray-200 rounded-full overflow-hidden'>
              <div 
                className='h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500'
                style={{ width: `${activeData.score}%` }}
              />
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            {activeData.tips.map((tip, index) => (
              <div key={index} className='flex flex-col gap-2 p-4 bg-gray-50 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <img 
                    src={tip.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'} 
                    alt={tip.type} 
                    className='w-5 h-5'
                  />
                  <span className='font-semibold text-gray-800'>{tip.tip}</span>
                </div>
                {tip.explanation && (
                  <p className='text-sm text-gray-600 ml-7'>{tip.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Details