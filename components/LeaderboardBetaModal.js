// components/LeaderboardBetaModal.js
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function LeaderboardBetaModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Info className="w-6 h-6 text-purple-600" />
          <h2 className="text-lg font-bold">Leaderboard Beta</h2>
        </div>
        <p className="text-sm">
          Our brand-new weekly leaderboard is now live! Here’s how it works:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Submit your score once per day to enter the Top 10.</li>
          <li>Leaderboard resets every Monday at 00:00 UTC (midnight).</li>
          <li>Top 10 players are shown; everyone else sees their own rank below.</li>
          <li>Country flags use native emoji — desktop support may vary.</li>
          <li>Tap the “i” icon anywhere in the app to view scoring rules.</li>
        </ul>
        <p className="text-xs text-gray-500">
          <strong>Known issues:</strong><br />
          • Flags may render as two‐letter codes on some desktops.<br />
          • Tooltip “i” sometimes needs a double-tap on older mobiles.<br />
          • Found another bug? Please let us know!
        </p>
        <div className="flex justify-end">
          <Button onClick={onClose}>Got it!</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
