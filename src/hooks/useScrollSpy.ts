import { useState, useEffect, RefObject } from "react";

export function useScrollSpy(
  ids: string[],
  offset: number = 100,
  containerRef?: RefObject<HTMLElement | null>
) {
  const [activeId, setActiveId] = useState<string>(ids[0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = containerRef?.current
        ? containerRef.current.scrollTop + offset
        : window.scrollY + offset;

      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            // Remove 'p-' prefix if it exists to normalize the ID
            const normalizedId = id.startsWith("p-") ? id.substring(2) : id;
            setActiveId(normalizedId);
          }
        }
      }
    };

    const scrollContainer = containerRef?.current || window;
    scrollContainer.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [ids, offset, containerRef]);

  return activeId;
}
