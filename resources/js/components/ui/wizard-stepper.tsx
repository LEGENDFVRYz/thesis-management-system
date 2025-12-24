import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// Wizard Container
const WizardStepper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative', className)} {...props} />
));
WizardStepper.displayName = 'WizardStepper';

// Wizard Steps Container
const WizardSteps = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-start justify-between w-full', className)}
        {...props}
    />
));
WizardSteps.displayName = 'WizardSteps';

// Individual Step
interface WizardStepProps extends React.HTMLAttributes<HTMLDivElement> {
    isCompleted?: boolean;
    isCurrent?: boolean;
    isLast?: boolean;
    stepNumber: number;
    title: string;
    description: string;
}

const WizardStep = React.forwardRef<HTMLDivElement, WizardStepProps>(
    (
        {
            className,
            isCompleted = false,
            isCurrent = false,
            isLast = false,
            stepNumber,
            title,
            description,
            ...props
        },
        ref,
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-col items-center relative w-full',
                    className,
                )}
                {...props}
            >
                {/* Step Circle and Connector Line */}
                <div className="relative w-full flex justify-center mb-3">
                    {/* Circle */}
                    <div
                        className={cn(
                            'relative z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)]',
                            isCompleted || isCurrent
                                ? 'bg-primary'
                                : 'bg-primary-foreground-2',
                        )}
                    >
                        <span
                            className={cn(
                                'text-base font-medium font-dm',
                                isCurrent
                                    ? 'text-primary-foreground'
                                    : isCompleted
                                      ? 'text-primary-foreground-2'
                                      : 'text-foreground',
                            )}
                        >
                            {stepNumber}
                        </span>
                    </div>

                    {/* Connector Line */}
                    {!isLast && (
                        <div className="absolute top-5 left-[calc(50%+20px)] right-[-50%] h-0.5 bg-primary-foreground-2 z-0">
                            <div
                                className={cn(
                                    'h-full bg-primary transition-all duration-300',
                                    isCompleted
                                        ? 'w-full'
                                        : isCurrent
                                          ? 'w-[10px]'
                                          : 'w-0',
                                )}
                            />
                        </div>
                    )}
                </div>

                {/* Step Text */}
                <div className="text-center">
                    <div
                        className={cn(
                            'text-[13px] mb-1 font-dm',
                            isCompleted || isCurrent
                                ? 'text-primary font-semibold'
                                : 'text-foreground font-medium',
                        )}
                    >
                        {title}
                    </div>
                    <div className="text-xs font-medium text-foreground font-dm leading-tight">
                        {description.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                </div>
            </div>
        );
    },
);
WizardStep.displayName = 'WizardStep';

// Navigation Buttons
const WizardNavigation = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex items-center justify-between', className)}
        {...props}
    />
));
WizardNavigation.displayName = 'WizardNavigation';

interface WizardButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

const WizardButton = React.forwardRef<HTMLButtonElement, WizardButtonProps>(
    ({ className, variant = 'primary', children, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                'flex items-center gap-2 h-8 px-3 rounded-[10px] font-medium text-[15px] tracking-[-0.6px] font-dm transition-colors',
                variant === 'primary' &&
                    'bg-primary-foreground-2 hover:bg-yellow-500 text-foreground',
                variant === 'secondary' &&
                    'bg-muted hover:bg-secondary text-muted-foreground',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    ),
);
WizardButton.displayName = 'WizardButton';

// Interactive Wizard Demo (for UI showcase)
interface InteractiveWizardProps {
    stepCount?: number;
}

const InteractiveWizard = ({ stepCount = 4 }: InteractiveWizardProps) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Generate steps dynamically based on stepCount
    const steps = Array.from({ length: stepCount }, (_, i) => ({
        number: i + 1,
        title: `Step ${i + 1}`,
        description: 'Step Description',
    }));

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stepper */}
            <WizardStepper>
                <WizardSteps>
                    {steps.map((step, index) => {
                        const isCompleted = currentStep > step.number;
                        const isCurrent = currentStep === step.number;
                        const isLast = index === steps.length - 1;

                        return (
                            <WizardStep
                                key={step.number}
                                stepNumber={step.number}
                                title={step.title}
                                description={step.description}
                                isCompleted={isCompleted}
                                isCurrent={isCurrent}
                                isLast={isLast}
                            />
                        );
                    })}
                </WizardSteps>
            </WizardStepper>

            {/* Navigation */}
            <WizardNavigation>
                {currentStep > 1 ? (
                    <WizardButton variant="secondary" onClick={handlePrevious}>
                        <ArrowLeft className="w-6 h-6" strokeWidth={2} />
                        <span>Previous</span>
                    </WizardButton>
                ) : (
                    <div />
                )}

                {currentStep < steps.length && (
                    <WizardButton
                        variant="primary"
                        onClick={handleNext}
                        className="ml-auto"
                    >
                        <span>Continue</span>
                        <ArrowRight className="w-6 h-6" strokeWidth={2} />
                    </WizardButton>
                )}
            </WizardNavigation>
        </div>
    );
};

export {
    WizardStepper,
    WizardSteps,
    WizardStep,
    WizardNavigation,
    WizardButton,
    InteractiveWizard,
};