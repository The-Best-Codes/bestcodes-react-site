"use client";
import { useEffect, useRef, useState } from "react";

interface OrnamentPosition {
  top: number;
  left: number;
}

interface OrnamentPositions {
  [key: string]: OrnamentPosition;
}

interface Ornament {
  id: string;
  color: string;
  initialTop: number;
  initialLeft: number;
}

const ChristmasGlobe = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const [ornamentPositions, setOrnamentPositions] = useState<OrnamentPositions>(
    {},
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeOrnament, setActiveOrnament] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null,
  );

  const ornaments: Ornament[] = [
    { id: "ornament-1", color: "red-500", initialTop: -101, initialLeft: -6 },
    {
      id: "ornament-2",
      color: "yellow-400",
      initialTop: -80,
      initialLeft: -12,
    },
    { id: "ornament-3", color: "blue-400", initialTop: -84, initialLeft: 5 },
    { id: "ornament-4", color: "blue-400", initialTop: -59, initialLeft: -17 },
    { id: "ornament-5", color: "red-500", initialTop: -65, initialLeft: 9 },
    { id: "ornament-6", color: "yellow-400", initialTop: -24, initialLeft: 5 },
    { id: "ornament-7", color: "red-500", initialTop: -44, initialLeft: -6 },
    { id: "ornament-8", color: "blue-400", initialTop: -39, initialLeft: 23 },
    { id: "ornament-9", color: "yellow-400", initialTop: 8, initialLeft: -41 },
    { id: "ornament-10", color: "blue-400", initialTop: -5, initialLeft: 4 },
    { id: "ornament-11", color: "red-500", initialTop: 8, initialLeft: -27 },
    {
      id: "ornament-12",
      color: "yellow-400",
      initialTop: -6,
      initialLeft: -13,
    },
    { id: "ornament-13", color: "blue-400", initialTop: 9, initialLeft: 27 },
    {
      id: "ornament-14",
      color: "yellow-400",
      initialTop: -36,
      initialLeft: -27,
    },
  ];

  useEffect(() => {
    const createSnowflake = () => {
      if (!globeRef.current) return;

      const snowflake = document.createElement("div");
      snowflake.className = "absolute w-2 h-2 bg-white rounded-full opacity-80";
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.top = "-8px";

      globeRef.current.appendChild(snowflake);

      const animation = snowflake.animate(
        [
          { transform: "translateY(0)", opacity: 0.8 },
          {
            transform: `translateY(${globeRef.current.clientHeight}px)`,
            opacity: 0,
          },
        ],
        {
          duration: Math.random() * 3000 + 2000,
          easing: "linear",
        },
      );

      animation.onfinish = () => snowflake.remove();
    };

    const intervalId = setInterval(createSnowflake, 200);
    return () => clearInterval(intervalId);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const ornament = document.getElementById(id);
    if (!ornament || !globeRef.current) return;

    const ornamentRect = ornament.getBoundingClientRect();
    const globeRect = globeRef.current.getBoundingClientRect();

    const offsetX = e.clientX - ornamentRect.left;
    const offsetY = e.clientY - ornamentRect.top;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
    setActiveOrnament(id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !activeOrnament || !globeRef.current || !dragOffset)
      return;

    const ornament = document.getElementById(activeOrnament);
    if (ornament) {
      const globeRect = globeRef.current.getBoundingClientRect();
      const treeContainer = ornament.parentElement;
      if (!treeContainer) return;

      const treeRect = treeContainer.getBoundingClientRect();

      const newTop = e.clientY - treeRect.top - dragOffset.y;
      const newLeft = e.clientX - treeRect.left - dragOffset.x;

      ornament.style.top = `${newTop}px`;
      ornament.style.left = `${newLeft}px`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !activeOrnament) return;

    // Gather all current ornament positions
    const updatedPositions: OrnamentPositions = {};
    ornaments.forEach((ornament) => {
      const elem = document.getElementById(ornament.id);
      if (elem) {
        const style = window.getComputedStyle(elem);
        const top = Math.round(parseFloat(style.top));
        const left = Math.round(parseFloat(style.left));
        updatedPositions[ornament.id] = { top, left };
      }
    });

    setOrnamentPositions(updatedPositions);
    console.log("All ornament positions:", updatedPositions);

    setIsDragging(false);
    setActiveOrnament(null);
    setDragOffset(null);
  };

  // Add mouse up listener to window to handle releases outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="text-4xl sm:text-7xl font-bold text-green-500 mb-8 sm:mb-12">
        Merry Christmas!
      </h1>

      <div className="relative">
        <div
          ref={globeRef}
          className="w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px]
                       rounded-full bg-gradient-to-br from-blue-100 to-blue-200
                       overflow-hidden shadow-2xl relative"
          onMouseMove={handleMouseMove}
        >
          {/* Snow on ground */}
          <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-white rounded-full transform translate-y-[40%]" />

          {/* Tree */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 scale-[1.2]">
            <div className="relative">
              {/* Tree trunk first (back layer) */}
              <div className="w-6 h-16 bg-amber-900 absolute -top-[10px] -left-3" />

              {/* Tree layers */}
              <div className="w-0 h-0 border-l-[60px] border-r-[60px] border-b-[80px] border-transparent border-b-green-900 absolute -top-[50px] -left-[60px]" />
              <div className="w-0 h-0 border-l-[50px] border-r-[50px] border-b-[70px] border-transparent border-b-green-800 absolute -top-[90px] -left-[50px]" />
              <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-transparent border-b-green-700 absolute -top-[120px] -left-[40px]" />

              {/* Decorations */}
              {ornaments.map((ornament) => (
                <div
                  key={ornament.id}
                  id={ornament.id}
                  onMouseDown={(e) => handleMouseDown(e, ornament.id)}
                  className={`absolute w-2.5 h-2.5 rounded-full bg-${ornament.color} cursor-pointer`}
                  style={{
                    top: `${ornamentPositions[ornament.id]?.top ?? ornament.initialTop}px`,
                    left: `${ornamentPositions[ornament.id]?.left ?? ornament.initialLeft}px`,
                    position: "absolute",
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChristmasGlobe;
