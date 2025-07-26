import { useEffect } from "react";

type ShortcutKeyMap = {
  [key: string]: (e: KeyboardEvent) => void;
};

export const useKeyboardShortcuts = (shortcuts: ShortcutKeyMap) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyCombo = [
        e.ctrlKey ? "ctrl" : "",
        e.metaKey ? "cmd" : "",
        e.altKey ? "alt" : "",
        e.shiftKey ? "shift" : "",
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join("+");

      if (shortcuts[keyCombo]) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          (e.target as HTMLElement)?.isContentEditable
        ) {
          return;
        }

        e.preventDefault();
        shortcuts[keyCombo](e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
};
