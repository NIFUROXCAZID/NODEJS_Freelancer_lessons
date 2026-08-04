import { useEffect, useState } from "react";

interface UseGoTopResult {
  shown: boolean;
  scrollToTop: (smooth?: boolean) => void;
}

export default function useGoTop(threshold: number = 1): UseGoTopResult {
  const [shown, setShown] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;

      setShown(scrollY > windowHeight * threshold);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  const scrollToTop = (smooth: boolean = true): void => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  return {
    shown,
    scrollToTop,
  };
}
