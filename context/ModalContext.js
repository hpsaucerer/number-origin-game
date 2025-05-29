// context/ModalContext.js
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false); // ✅ Add this

  return (
    <ModalContext.Provider value={{
      showAchievements,
      setShowAchievements,
      showStatsModal,
      setShowStatsModal
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}

export { ModalContext };
