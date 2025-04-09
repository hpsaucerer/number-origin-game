import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WelcomeModal({ open, onOpenChange, showTutorial, setShowTutorial }) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="w-full max-w-[480px] mx-auto rounded-xl">

<DialogHeader>
  <p className="text-xl font-bold text-center">
    Numerus
  </p>
  <p className="text-center text-gray-600 text-base mt-1">
    The daily reverse trivia game.
  </p>
</DialogHeader>

        {/* Description */}
        <p className="text-base text-center mt-2">
          Strengthen your trivia muscle, one number at a time. Start your workout now!
        </p>
{/* ...existing instructions... */}

<div className="mt-4 flex justify-center">
  <img
    src="/tutorial.gif"
    alt="How to play example"
    className="max-w-full w-[300px] rounded shadow-lg"
  />
</div>

        {/* Confirm Button */}
        <div className="flex justify-center mt-6">
          <Button onClick={() => onOpenChange(false)}>
            Got it — Let’s Play!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
