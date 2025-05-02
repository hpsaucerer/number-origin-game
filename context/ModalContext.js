// context/ModalContext.js
import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showAchievements, setShowAchievements] = useState(false);

  return (
    <ModalContext.Provider value={{ showAchievements, setShowAchievements }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
