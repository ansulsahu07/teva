import React, { useEffect, useState } from "react";
import { SCREEN_WIDTH } from "../constants/ui";

const useScreenSize = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= SCREEN_WIDTH);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= SCREEN_WIDTH);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
};

export default useScreenSize;
