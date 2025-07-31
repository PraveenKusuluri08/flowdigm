import { useContext } from "react";
import { CanvasContext } from "../context/CanvasEditorProvider";

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within CanvasProvider');
  }
  return context;
};