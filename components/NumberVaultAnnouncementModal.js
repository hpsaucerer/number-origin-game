// components/NumberVaultAnnouncementModal.js
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NumberVaultAnnouncementModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-xl p-6 space-y-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Introducing… Number Vault!
          </DialogTitle>
        </DialogHeader>
        <p>
          We’ve just launched your new <strong>Number Vault</strong> — a complete record of
          every number you’ve unlocked. Scroll through every number you’ve solved and revisit
          any Nugget of Knowledge™ at will!
        </p>
        <img
          src="/number-vault-preview.png"
          alt="Screenshot of the Number Vault page"
          className="w-full rounded-md shadow-sm"
        />
        <h4 className="font-semibold">Also in this release:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Fixed mobile scroll in post-game modal so you can always reach the Share buttons.</li>
          <li>Category tiles wrap neatly on all screen sizes.</li>
          <li>Performance improvements and bug-squashes throughout.</li>
        </ul>
        <div className="flex justify-end">
          <Button onClick={onClose}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
