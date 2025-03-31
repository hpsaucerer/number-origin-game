import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function InteractiveTutorial({ open, onClose }) {
  const [step, setStep] = useState(0);

  const exampleSteps = [
    {
      number: "299792458",
      message: "Welcome! Let's explore how the game works. Here's a number: 299792458",
    },
    {
      number: "299,792,458",
      message: "After your first incorrect guess, you'll see a clue — and the number might be reformatted.",
    },
    {
      number: "299,792,458 m/s",
      message: "Another guess unlocks a clearer clue. Now the format and unit give it away!",
    },
    {
      number: "Speed of Light",
      message: "The answer is: Speed of Light! You get 4 guesses per day. Ready to play?",
    },
  ];

  const nextStep = () => {
    if (step < exampleSteps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-[#3B82F6]">{exampleSteps[step].number}</p>
          <p>{exampleSteps[step].message}</p>
          <Button onClick={nextStep}>{step === exampleSteps.length - 1 ? "Start Playing!" : "Next"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
