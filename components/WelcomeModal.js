import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function WelcomeModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Overlay */}
      <DialogOverlay className="fixed inset-0 bg-white/95 backdrop-blur-md backdrop-saturate-150 z-[9997]" />

      {/* High z-index wrapper to contain modal and prevent button ghosting */}
<div className="fixed inset-0 z-[9999] overflow-y-auto px-4 min-h-screen flex justify-center items-start pt-[10vh]">
  <DialogContent
    className="..."
    style={{ zIndex: 9999, margin: 0 }}
  >
          <DialogHeader>
            <p className="text-xl font-bold text-center">Numerus</p>
            <p className="text-center text-gray-600 text-base mt-1 italic">
              The daily reverse trivia game.
            </p>
          </DialogHeader>

          <p className="text-base text-center mt-2">
             Ready to get started? Watch this quick tutorial! ⬇️
          </p>

          <div className="mt-4 flex justify-center">
            <img
              src="/tutorialnew.gif"
              alt="How to play example"
              className="max-w-full w-[300px] rounded shadow-lg"
            />
          </div>

          <div className="flex justify-center mt-6">
<Button
  onClick={() => onOpenChange(false)}
  className="bg-[#63c4a7] text-white hover:bg-[#4ea68d] transition font-semibold px-4 py-2 rounded"
>
  Got it — Let’s Play!
</Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
