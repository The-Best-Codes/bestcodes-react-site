import React, { useEffect, useRef, useState } from "react";
import { RoughNotation } from "react-rough-notation";

interface UnderlineTextProps {
  children: React.ReactNode;
  color: string;
  className?: string;
  strokeWidth?: number;
  padding?: number;
  activationType: "always" | "hover" | "click" | "view";
}

const UnderlineText: React.FC<UnderlineTextProps> = ({
  children,
  className = "",
  activationType,
  color = "",
  strokeWidth = 2,
  padding = 2,
}) => {
  const [show, setShow] = useState(activationType === "always");
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const currentRef = textRef.current;

    if (activationType === "always") {
      setShow(true);
    } else if (activationType === "hover") {
      const handleMouseEnter = () => setShow(true);
      const handleMouseLeave = () => setShow(false);

      currentRef?.addEventListener("mouseenter", handleMouseEnter);
      currentRef?.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        currentRef?.removeEventListener("mouseenter", handleMouseEnter);
        currentRef?.removeEventListener("mouseleave", handleMouseLeave);
      };
    } else if (activationType === "click") {
      const handleClick = () => setShow((prevShow) => !prevShow);

      currentRef?.addEventListener("click", handleClick);

      return () => {
        currentRef?.removeEventListener("click", handleClick);
      };
    } else if (activationType === "view") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setShow(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );

      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }
  }, [activationType]);

  // Force redraw when children change
  useEffect(() => {
    setShow(false);
    setTimeout(() => setShow(true), 0);
  }, [children]);

  return (
    <span ref={textRef} className={className}>
      <RoughNotation
        type="underline"
        show={show}
        color={color}
        strokeWidth={strokeWidth}
        padding={padding}
      >
        {children}
      </RoughNotation>
    </span>
  );
};

export default UnderlineText;