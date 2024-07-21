import React, { useEffect, useRef, useState } from "react";
import { RoughNotation } from "react-rough-notation";

interface UnderlineTextProps {
  text: string;
  color: string;
  className?: string;
  stokeWidth?: number;
  padding?: number;
  activationType: "always" | "hover" | "click";
}

const UnderlineText: React.FC<UnderlineTextProps> = ({
  text,
  className = "",
  activationType,
  color = "",
  stokeWidth = 2,
  padding = 2,
}) => {
  const [show, setShow] = useState(activationType === "always");
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const currentRef = textRef.current; // Capture the current value

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
    }
  }, [activationType]);

  return (
    <span ref={textRef} className={className}>
      <RoughNotation
        type="underline"
        show={show}
        color={color}
        strokeWidth={stokeWidth}
        padding={padding}
      >
        {text}
      </RoughNotation>
    </span>
  );
};

export default UnderlineText;
