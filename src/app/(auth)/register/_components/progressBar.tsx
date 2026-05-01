interface ProgressBarProps {
    currentStep: number
    totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    return (
        <div className="w-full mb-2.5">
            {/* Progress Line with Steps */}
            <div className="relative flex items-center justify-between">
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1
                    const isCompleted = stepNumber < currentStep
                    const isCurrent = stepNumber === currentStep
                    const isUpcoming = stepNumber > currentStep

                    return (
                        <div key={stepNumber} className={`relative ${stepNumber < totalSteps && 'flex-1'} flex items-center`}>
                            {/* Diamond/Square Step Indicator */}
                            <div className="relative z-10 flex items-center justify-center diamond">
                                <div
                                    className={`size-2.5 transform rotate-45 transition-all duration-300 ${isCompleted || isCurrent
                                        ? 'bg-blue-600 '
                                        : 'bg-blue-50 border-2 border-blue-600'
                                        }`}
                                >
                                    {/* Inner white diamond for current step */}
                                    {isCurrent && (
                                        <div className="absolute inset-0.5" />
                                    )}
                                </div>
                            </div>

                            {/* Connecting Line */}
                            {stepNumber < totalSteps && (
                                <div className="flex-1 h-px mx-1.5 relative test">
                                    {/* Solid line for completed steps */}
                                    {isCompleted && (
                                        <div className="absolute inset-0 bg-blue-600" />
                                    )}

                                    {/* Dashed line for upcoming steps */}
                                    {(isCurrent || isUpcoming) && (
                                        <div
                                            className="absolute inset-0 line"
                                            style={{
                                                backgroundImage: 'linear-gradient(to right, currentColor 50%, transparent 50%)',
                                                backgroundSize: '8px 35px',
                                                backgroundRepeat: 'repeat-x'
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

        </div>
    )
}