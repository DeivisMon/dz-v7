import { useEffect } from 'react';


export const useClickOutside = (refs, handler) => {
  useEffect(() => {
    const listener = (e) => {
      const isInside = refs.some(ref =>
        ref.current && ref.current.contains(e.target)
      );

      if (!isInside) handler(e);
    };

    document.addEventListener("pointerdown", listener);
    return () => document.removeEventListener("pointerdown", listener);
  }, [refs, handler]);
};