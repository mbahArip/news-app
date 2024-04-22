import { useEffect, useState } from "react";

export default function useMediaQuery(q: string) {
  const [val, setVal] = useState<boolean>(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setVal(event.matches);
    }

    const result = matchMedia(q);
    result.addEventListener("change", onChange);
    setVal(result.matches);

    return () => {
      result.removeEventListener("change", onChange);
    };
  }, [q]);

  return val;
}
