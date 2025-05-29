import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false); // ✅ ADD THIS

  return (
    <ModalContext.Provider value={{
      showAchievements,
      setShowAchievements,
      showStatsModal,
      setShowStatsModal, // ✅ ADD THIS
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}

export { ModalContext };
