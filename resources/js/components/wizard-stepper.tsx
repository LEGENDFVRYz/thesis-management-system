import { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { WizardStepper as WizardStepperUI, WizardSteps, WizardStep, WizardNavigation, WizardButton } from '@/components/ui/wizard-stepper';

interface Step {
    number: number;
    title: string;
    description: string;
}

const defaultSteps: Step[] = [
    { number: 1, title: 'Step 1', description: 'Step Description' },
    { number: 2, title: 'Step 2', description: 'Step Description' },
    { number: 3, title: 'Step 3', description: 'Step Description' },
    { number: 4, title: 'Step 4', description: 'Step Description' },
];

interface WizardStepperProps {
    steps?: Step[];
    onClose?: () => void;
    title?: string;
    children?: React.ReactNode;
}

export function WizardStepper({
    steps = defaultSteps,
    onClose,
    title = 'Wizard Demo / Sample',
    children,
}: WizardStepperProps) {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleClose = () => {
        setCurrentStep(1);
        onClose?.();
    };

    return (
        <div className="w-full max-w-[650px] mx-auto bg-card rounded-[10px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.10)] p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h1 className="text-base font-bold tracking-[-0.64px] font-dm text-foreground">
                    {title}
                </h1>
                <button
                    onClick={handleClose}
                    className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity text-foreground"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" strokeWidth={2} />
                </button>
            </div>

            {/* Stepper */}
            <div className="mb-6 sm:mb-10">
                <WizardStepperUI>
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
                </WizardStepperUI>
            </div>

            {/* Content Area */}
            <div className="mb-8 sm:mb-12 min-h-[200px] flex items-center justify-center">
                {children || (
                    <div className="flex items-center justify-center h-full text-center px-4 py-8">
                        <p className="text-muted-foreground text-sm font-dm">
                            Content goes here
                        </p>
                    </div>
                )}
            </div>

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
}
