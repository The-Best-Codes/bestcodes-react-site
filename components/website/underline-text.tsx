import React, { useEffect, useRef, useState } from "react";
import { RoughNotation } from "react-rough-notation";

interface UnderlineTextProps {
  children: React.ReactNode;
  color: string;
  className?: string;
  strokeWidth?: number;
  padding?: number;
  activationType: "always" | "hover" | "click" | "view";
  animationDelay?: number;
  animationDuration?: number;
}

const UnderlineText: React.FC<UnderlineTextProps> = ({
  children,
  className = "",
  activationType,
  color = "",
  strokeWidth = 2,
  padding = 2,
  animationDelay = 0,
  animationDuration = 500,
}) => {
  const [show, setShow] = useState(activationType === "always");
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const currentRef = textRef.current;

    if (activationType === "always") {
      setShow(true);
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

  const handleMouseEnter = () => {
    if (activationType === "hover") {
      setShow(true);
    }
  };

  const handleMouseLeave = () => {
    if (activationType === "hover") {
      setShow(false);
    }
  };

  return (
    <span
      ref={textRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <RoughNotation
        type="underline"
        show={show}
        color={color}
        strokeWidth={strokeWidth}
        padding={padding}
        animationDelay={animationDelay}
        animationDuration={animationDuration}
      >
        {children}
      </RoughNotation>
    </span>
  );
};

export default UnderlineText;
