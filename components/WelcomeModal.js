import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WelcomeModal({ open, onOpenChange, showTutorial, setShowTutorial }) {
  return (
<Dialog open={open} onOpenChange={onOpenChange}>
  {/* Overlay */}
  <DialogOverlay className="fixed inset-0 bg-white/90 backdrop-blur-md z-[9997]" />

  {/* High-level wrapper with extreme z-index context */}
  <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-12 px-4">
    <DialogContent
      className="rounded-xl shadow-xl bg-white w-full max-w-md"
      style={{ zIndex: 9999 }}
    >
      <DialogHeader>
        <p className="text-xl font-bold text-center">Numerus</p>
        <p className="text-center text-gray-600 text-base mt-1 italic">
          The daily reverse trivia game.
        </p>
      </DialogHeader>

      <p className="text-base text-center mt-2">
        Strengthen your trivia muscle, one number at a time. Start your workout now!
      </p>

      <div className="mt-4 flex justify-center">
        <img
          src="/tutorialnew.gif"
          alt="How to play example"
          className="max-w-full w-[300px] rounded shadow-lg"
        />
      </div>

      <div className="flex justify-center mt-6">
        <Button onClick={() => onOpenChange(false)}>
          Got it — Let’s Play!
        </Button>
      </div>
    </DialogContent>
  </div>
</Dialog>

