import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                  isComplete
                    ? "border-blue-600 bg-blue-600 text-white"
                    : isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-slate-200 text-slate-400"
                }`}
              >
                {isComplete ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  isActive || isComplete ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNumber !== steps.length && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded transition-colors ${
                  isComplete ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Stepper;
