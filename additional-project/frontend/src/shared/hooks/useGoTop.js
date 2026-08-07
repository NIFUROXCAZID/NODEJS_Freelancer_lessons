import { useEffect, useState } from "react";

export default function useGoTop(threshold = 1) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      // якщо прокрутили більше ніж висота вікна * threshold
      if (scrollY > windowHeight * threshold) {
        setShown(true);
      } else {
        setShown(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // щоб перевірити одразу при завантаженні

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  // Функція для прокрутки до гори
  const scrollToTop = (smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  return { shown, scrollToTop };
}