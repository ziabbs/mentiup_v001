"use client"

interface StepMessageProps {
  message: string
  subMessage?: string
  previousChoice?: {
    label: string
    value: string
  }
}

export function StepMessage({
  message,
  subMessage,
  previousChoice
}: StepMessageProps) {
  return (
    <div className="space-y-6" role="region" aria-label="Adım bilgileri">
      {/* Önceki seçim gösterimi */}
      {previousChoice && (
        <div 
          className="relative max-w-[85%] sm:max-w-[75%] ml-auto transform hover:-translate-y-0.5 transition-all duration-300"
          role="region"
          aria-label="Önceki adımdaki seçiminiz"
        >
          <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/40
                          rounded-[28px] rounded-br-[4px] p-4 shadow-md hover:shadow-lg transition-shadow
                          border border-emerald-200/50 dark:border-emerald-700/30">
            {/* Üçgen şekil */}
            <div className="absolute right-0 -bottom-3 w-6 h-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/40
                           transform rotate-45 translate-x-1/2 border-r border-b border-emerald-200/50 dark:border-emerald-700/30" />
            
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 mt-0.5 flex-shrink-0">
                <svg 
                  viewBox="0 0 20 20" 
                  className="text-emerald-500 dark:text-emerald-400 animate-pulse"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  {previousChoice.label}
                </p>
                <p className="text-sm italic text-emerald-700/90 dark:text-emerald-300/90 tracking-wide">
                  {previousChoice.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ana mesaj baloncuğu */}
      <div className="relative max-w-[85%] sm:max-w-[75%]" role="region" aria-label="Lola'nın mesajı">
        <div className="relative bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-600 dark:to-violet-700 
                     rounded-[28px] rounded-bl-[4px] p-5 shadow-lg hover:shadow-xl transition-shadow
                     border border-violet-400/20 dark:border-violet-500/20">
          {/* Üçgen şekil */}
          <div className="absolute left-0 -bottom-3 w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-600 dark:to-violet-700
                         transform rotate-45 -translate-x-1/2 border-l border-b border-violet-400/20 dark:border-violet-500/20" />
          
          <div className="relative space-y-2.5">
            <p className="text-base sm:text-lg text-white font-medium italic leading-relaxed tracking-wide">
              {message}
            </p>
            {subMessage && (
              <p className="text-sm text-violet-50 dark:text-violet-100 italic leading-relaxed opacity-90">
                {subMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
