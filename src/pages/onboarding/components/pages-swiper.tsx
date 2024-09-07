import { useState } from "react";
import { cn } from "@/lib/utils";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { Greeting } from "./greeting";

export function PagesSwiper() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="w-full lg:w-1/2 h-full m-auto overflow-hidden flex flex-col">
      {/* Progress Indicator */}
      <div className="w-full h-6 flex justify-between items-center p-4 gap-4 lg:p-8">
        <div
          className={cn(
            "lg:w-1/6 w-1/4 rounded-full h-2",
            currentStep >= 1 ? "bg-primary" : "bg-secondary"
          )}
        ></div>
        <div
          className={cn(
            "lg:w-1/6 w-1/4 rounded-full h-2",
            currentStep >= 2 ? "bg-primary" : "bg-secondary"
          )}
        ></div>
        <div
          className={cn(
            "lg:w-1/6 w-1/4 rounded-full h-2",
            currentStep >= 3 ? "bg-primary" : "bg-secondary"
          )}
        ></div>
        <div
          className={cn(
            "lg:w-1/6 w-1/4 rounded-full h-2",
            currentStep >= 4 ? "bg-primary" : "bg-secondary"
          )}
        ></div>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 lg:p-8 w-full flex-1 overflow-y-auto">
        {currentStep === 1 && <Greeting />}
        {/* Add content for other steps as needed */}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center w-full p-4">
        <button
          className="text-primary flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:text-muted"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          <FaArrowLeft size={18} />
          Prev
        </button>
        <button
          className="text-primary flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:text-muted"
          disabled={currentStep === 4}
          onClick={() => setCurrentStep((prev) => prev + 1)}
        >
          Next <FaArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
