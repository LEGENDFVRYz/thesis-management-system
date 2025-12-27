import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// Wizard Container
const WizardStepper = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative', className)} {...props} />
));
WizardStepper.displayName = 'WizardStepper';

// Wizard Steps Container
const WizardSteps = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex items-start w-full relative pb-20', // ⬅ reserve space for labels
            className,
        )}
        {...props}
    />
));
WizardSteps.displayName = 'WizardSteps';

// Individual Step (One circle + one connector)
interface WizardStepProps extends React.HTMLAttributes<HTMLDivElement> {
    state?: 'before' | 'current' | 'after';
    isLast?: boolean;
    stepNumber: number;
    title: string;
    description: string;
}

const WizardStep = React.forwardRef<HTMLDivElement, WizardStepProps>(
    (
        {
            className,
            state = 'before',
            isLast = false,
            stepNumber,
            title,
            description,
            ...props
        },
        ref,
    ) => {
        // Determine state
        const isBefore = state === 'before';
        const isCurrent = state === 'current';
        const isAfter = state === 'after';

        // Colors
        const circleColor = isBefore
            ? 'bg-primary-foreground-2'
            : 'bg-primary';

        const numberColor = isCurrent
            ? 'text-primary-foreground'
            : isAfter
            ? 'text-primary-foreground-2'
            : 'text-foreground';

        const connectorBg = isBefore
            ? 'bg-primary-foreground-2'
            : 'bg-primary';

        const titleColor =
            isCurrent || isAfter
                ? 'text-primary font-semibold'
                : 'text-foreground font-medium';

        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-col',
                    isLast ? 'flex-shrink-0' : 'flex-1',
                    className,
                )}
                {...props}
            >
                {/* Timeline Row */}
                <div className="flex items-center w-full">
                    {/* Circle anchor */}
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <div
                            className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)]',
                                circleColor,
                            )}
                        >
                            <span
                                className={cn(
                                    'text-base font-medium font-dm',
                                    numberColor,
                                )}
                            >
                                {stepNumber}
                            </span>
                        </div>

                        {/* Label */}
                        <div className="absolute top-full left-1/2 mt-3 -translate-x-1/2 w-15 text-center">
                            <div
                                className={cn(
                                    'text-[13px] mb-1 font-dm',
                                    titleColor,
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

                    {/* Connector aligned strictly to circle center */}
                    {!isLast && (
                        <div className="flex-1 mx-2">
                            <div className="w-full h-0.5">
                                {isCurrent ? (
                                    <div className="relative w-full h-full bg-primary-foreground-2">
                                        <div
                                            className="absolute left-0 h-full bg-primary transition-all duration-300"
                                            style={{ width: '20%' }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className={cn(
                                            'w-full h-full',
                                            connectorBg,
                                        )}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    },
);
WizardStep.displayName = 'WizardStep';

// Navigation Buttons
const WizardNavigation = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
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

    // Generate steps dynamically
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

    // Determine state for each step
    const getStepState = (
        stepNumber: number,
    ): 'before' | 'current' | 'after' => {
        if (stepNumber < currentStep) return 'after';
        if (stepNumber === currentStep) return 'current';
        return 'before';
    };

    return (
        <div className="space-y-8">
            {/* Stepper */}
            <WizardStepper>
                <WizardSteps>
                    {steps.map((step, index) => (
                        <WizardStep
                            key={step.number}
                            stepNumber={step.number}
                            title={step.title}
                            description={step.description}
                            state={getStepState(step.number)}
                            isLast={index === steps.length - 1}
                        />
                    ))}
                </WizardSteps>
            </WizardStepper>

            {/* Navigation */}
            <WizardNavigation>
                {currentStep > 1 ? (
                    <WizardButton
                        variant="secondary"
                        onClick={handlePrevious}
                    >
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