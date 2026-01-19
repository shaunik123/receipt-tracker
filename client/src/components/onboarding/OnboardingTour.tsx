import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

interface Step {
  title: string;
  description: string;
  target?: string;
}

const steps: Step[] = [
  {
    title: "Welcome to Ledgerly",
    description: "Your AI-powered companion for effortless receipt tracking and expense management.",
  },
  {
    title: "Quick Scan",
    description: "Tap the camera icon to instantly scan any receipt. Our AI handles the details.",
    target: "button-scan-nav",
  },
  {
    title: "Smart Insights",
    description: "Track your spending patterns and get AI-powered recommendations to save more.",
    target: "link-insights-nav",
  },
  {
    title: "Manage Expenses",
    description: "View, edit, and export your transaction history with ease.",
    target: "link-expenses-nav",
  },
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenTour) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-sm glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
          
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <h2 className="text-2xl font-display font-black text-white mb-4 tracking-tight">
                {steps[currentStep].title}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                {steps[currentStep].description}
              </p>
            </motion.div>

            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-white/40 hover:text-white disabled:opacity-0"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </Button>
              
              <Button
                onClick={nextStep}
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
