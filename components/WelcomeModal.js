import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WelcomeModal({ open, onOpenChange, showTutorial, setShowTutorial }) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Numerus
          </DialogTitle>
        </DialogHeader>

        {/* Description */}
        <p className="text-sm text-center mt-2">
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
