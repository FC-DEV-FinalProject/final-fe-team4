import { KeyboardEvent } from 'react';

type KeyAction = 'tab' | 'enter' | 'escape' | 'arrowUp' | 'arrowDown';

interface KeyConfig {
  enabled: boolean;
  action?: () => void;
  preventDefault?: boolean;
}

interface UseKeyboardNavigationProps {
  keyActions: Partial<Record<KeyAction, KeyConfig>>;
  focusLastElement?: boolean;
}

export const useKeyboardNavigation = ({
  keyActions,
  focusLastElement = true,
}: UseKeyboardNavigationProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const key = e.key.toLowerCase() as KeyAction;
    const config = keyActions[key];

    if (!config?.enabled) return;

    if (key === 'enter' && e.shiftKey) return;

    if (config.preventDefault !== false) {
      e.preventDefault();
    }

    if (key === 'tab') {
      const textareas = document.querySelectorAll('textarea');
      const currentIndex = Array.prototype.indexOf.call(textareas, e.target);
      const nextIndex = (currentIndex + 1) % textareas.length;
      textareas[nextIndex].focus();
    }

    config.action?.();

    if (key === 'enter' && focusLastElement) {
      setTimeout(() => {
        const textareas = document.querySelectorAll('textarea');
        if (textareas.length > 0) {
          textareas[textareas.length - 1].focus();
        }
      }, 0);
    }
  };

  return { handleKeyDown };
};
