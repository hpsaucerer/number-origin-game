import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function InstructionsModal({ open, onClose, renderCategoryPills }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <DialogContent className="relative max-h-[90vh] overflow-y-auto pt-3 px-4 pb-4 sm:max-w-md w-full flex flex-col items-start justify-center">
          {/* Dismiss Button */}
          <button
            className="absolute top-1 right-1 p-2 text-blue-500 hover:text-blue-600 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={28} />
          </button>

<DialogHeader className="w-full">
  <DialogTitle>
    <h2 className="text-lg text-gray-800 text-left">How To Play</h2>
  </DialogTitle>
</DialogHeader>

          <div className="mt-2 font-vietnam">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <img src="/icons/one.png" alt="Look Icon" className="w-6 h-6 mt-1" />
                <div>
                  <strong>Look at the number.</strong><br />
                  What could it signify?
                </div>
              </li>
              <li className="flex items-start gap-3">
                <img src="/icons/two.png" alt="Type Icon" className="w-6 h-6 mt-1" />
                <div>
                  <strong>Make a guess. You have 4 in total.</strong><br />
                  Type what you think the number relates to; e.g. 'keys on a piano', 'moon landing'.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <img src="/icons/three.png" alt="Clue Icon" className="w-6 h-6 mt-1" />
                <div>
                  <strong>Stuck? Reveal a clue!</strong><br />
                  Remember though, this uses up a guess.
                </div>
              </li>
            </ul>

            <div className="flex justify-center mt-2">
              <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 w-full max-w-md text-center shadow-md">
                <h3 className="text-lg font-bold mb-1 text-gray-800">Categories</h3>
                <p className="text-sm text-gray-600 mb-3">Tap the buttons below to explore the categories in more detail.</p>
                {renderCategoryPills && renderCategoryPills()}
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
