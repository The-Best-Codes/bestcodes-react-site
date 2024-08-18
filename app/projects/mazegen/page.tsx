"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Head from "next/head";

interface Cell {
  x: number;
  y: number;
  walls: boolean[];
  visited: boolean;
}

const MazeGenerator: React.FC = () => {
  const [width, setWidth] = useState<number>(20);
  const [height, setHeight] = useState<number>(20);
  const [cellSize, setCellSize] = useState<number>(20);
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [solution, setSolution] = useState<[number, number][]>([]);
  const [currentWidth, setCurrentWidth] = useState<number>(20);
  const [currentHeight, setCurrentHeight] = useState<number>(20);
  const [currentCellSize, setCurrentCellSize] = useState<number>(20);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initializeMaze = useCallback((width: number, height: number) => {
    const newMaze: Cell[][] = [];
    for (let y = 0; y < height; y++) {
      newMaze[y] = [];
      for (let x = 0; x < width; x++) {
        newMaze[y][x] = {
          x,
          y,
          walls: [true, true, true, true],
          visited: false,
        };
      }
    }
    return newMaze;
  }, []);

  const generateMaze = useCallback(() => {
    const newWidth = width;
    const newHeight = height;
    const newCellSize = cellSize;
    setCurrentWidth(newWidth);
    setCurrentHeight(newHeight);
    setCurrentCellSize(newCellSize);
    const newMaze = initializeMaze(newWidth, newHeight);
    const stack: Cell[] = [];
    const startCell = newMaze[0][0];
    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
      const currentCell = stack.pop()!;
      const neighbors = getUnvisitedNeighbors(
        currentCell,
        newMaze,
        newWidth,
        newHeight
      );

      if (neighbors.length > 0) {
        stack.push(currentCell);
        const randomNeighbor =
          neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWalls(currentCell, randomNeighbor);
        randomNeighbor.visited = true;
        stack.push(randomNeighbor);
      }
    }

    setMaze(newMaze);
    const newSolution = solveMaze(newMaze, newWidth, newHeight);
    setSolution(newSolution);
  }, [width, height, cellSize, initializeMaze]);

  const getUnvisitedNeighbors = (
    cell: Cell,
    maze: Cell[][],
    width: number,
    height: number
  ) => {
    const { x, y } = cell;
    const neighbors: Cell[] = [];

    if (y > 0 && !maze[y - 1][x].visited) neighbors.push(maze[y - 1][x]); // Top
    if (x < width - 1 && !maze[y][x + 1].visited)
      neighbors.push(maze[y][x + 1]); // Right
    if (y < height - 1 && !maze[y + 1][x].visited)
      neighbors.push(maze[y + 1][x]); // Bottom
    if (x > 0 && !maze[y][x - 1].visited) neighbors.push(maze[y][x - 1]); // Left

    return neighbors;
  };

  const removeWalls = (cell1: Cell, cell2: Cell) => {
    const dx = cell2.x - cell1.x;
    const dy = cell2.y - cell1.y;

    if (dx === 1) {
      cell1.walls[1] = false;
      cell2.walls[3] = false;
    } else if (dx === -1) {
      cell1.walls[3] = false;
      cell2.walls[1] = false;
    } else if (dy === 1) {
      cell1.walls[2] = false;
      cell2.walls[0] = false;
    } else if (dy === -1) {
      cell1.walls[0] = false;
      cell2.walls[2] = false;
    }
  };

  const solveMaze = (
    maze: Cell[][],
    width: number,
    height: number
  ): [number, number][] => {
    const stack: [number, number][] = [[0, 0]];
    const visited: boolean[][] = maze.map((row) => row.map(() => false));
    const parent: ([number, number] | null)[][] = maze.map((row) =>
      row.map(() => null)
    );

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;

      if (x === width - 1 && y === height - 1) {
        // Found the end, reconstruct the path
        const path: [number, number][] = [];
        let current: [number, number] | null = [x, y];
        while (current !== null) {
          path.unshift(current);
          current = parent[current[1]][current[0]];
        }
        return path;
      }

      if (!visited[y][x]) {
        visited[y][x] = true;
        const cell = maze[y][x];

        // Check all four directions
        const directions = [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ];

        for (let i = 0; i < 4; i++) {
          if (!cell.walls[i]) {
            const newX = x + directions[i][0];
            const newY = y + directions[i][1];
            if (
              newX >= 0 &&
              newX < width &&
              newY >= 0 &&
              newY < height &&
              !visited[newY][newX]
            ) {
              stack.push([newX, newY]);
              parent[newY][newX] = [x, y];
            }
          }
        }
      }
    }

    return []; // No solution found
  };

  const drawMaze = (
    ctx: CanvasRenderingContext2D,
    maze: Cell[][],
    showSolution: boolean,
    solution: [number, number][],
    currentCellSize: number,
    currentWidth: number,
    currentHeight: number
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw maze
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.walls[0]) {
          ctx.beginPath();
          ctx.moveTo(x * currentCellSize, y * currentCellSize);
          ctx.lineTo((x + 1) * currentCellSize, y * currentCellSize);
          ctx.stroke();
        }
        if (cell.walls[1]) {
          ctx.beginPath();
          ctx.moveTo((x + 1) * currentCellSize, y * currentCellSize);
          ctx.lineTo((x + 1) * currentCellSize, (y + 1) * currentCellSize);
          ctx.stroke();
        }
        if (cell.walls[2]) {
          ctx.beginPath();
          ctx.moveTo(x * currentCellSize, (y + 1) * currentCellSize);
          ctx.lineTo((x + 1) * currentCellSize, (y + 1) * currentCellSize);
          ctx.stroke();
        }
        if (cell.walls[3]) {
          ctx.beginPath();
          ctx.moveTo(x * currentCellSize, y * currentCellSize);
          ctx.lineTo(x * currentCellSize, (y + 1) * currentCellSize);
          ctx.stroke();
        }
      });
    });

    // Draw solution
    if (showSolution) {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(currentCellSize / 2, currentCellSize / 2);
      solution.forEach(([x, y]) => {
        ctx.lineTo((x + 0.5) * currentCellSize, (y + 0.5) * currentCellSize);
      });
      ctx.stroke();
    }

    // Draw start and end markers
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(
      currentCellSize / 2,
      currentCellSize / 2,
      currentCellSize / 4,
      0,
      2 * Math.PI
    );
    ctx.fill();

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
      currentWidth * currentCellSize - currentCellSize / 2,
      currentHeight * currentCellSize - currentCellSize / 2,
      currentCellSize / 4,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };

  const printMaze = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(
        "<html><head><title>Maze</title></head><body>"
      );
      printWindow.document.write('<canvas id="printCanvas"></canvas>');
      printWindow.document.write("<script>");
      printWindow.document.write(`
      const canvas = document.getElementById('printCanvas');
      canvas.width = ${currentWidth * currentCellSize};
      canvas.height = ${currentHeight * currentCellSize};
      const ctx = canvas.getContext('2d');
      const maze = ${JSON.stringify(maze)};
      const showSolution = ${showSolution ? "true" : "false"};
      const solution = ${JSON.stringify(solution)};
      const currentCellSize = ${currentCellSize};
      const currentWidth = ${currentWidth};
      const currentHeight = ${currentHeight};
      
      // Define the drawMaze function
      function drawMaze(ctx, maze, showSolution, solution, currentCellSize, currentWidth, currentHeight) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw maze
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        maze.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell.walls[0]) {
              ctx.beginPath();
              ctx.moveTo(x * currentCellSize, y * currentCellSize);
              ctx.lineTo((x + 1) * currentCellSize, y * currentCellSize);
              ctx.stroke();
            }
            if (cell.walls[1]) {
              ctx.beginPath();
              ctx.moveTo((x + 1) * currentCellSize, y * currentCellSize);
              ctx.lineTo((x + 1) * currentCellSize, (y + 1) * currentCellSize);
              ctx.stroke();
            }
            if (cell.walls[2]) {
              ctx.beginPath();
              ctx.moveTo(x * currentCellSize, (y + 1) * currentCellSize);
              ctx.lineTo((x + 1) * currentCellSize, (y + 1) * currentCellSize);
              ctx.stroke();
            }
            if (cell.walls[3]) {
              ctx.beginPath();
              ctx.moveTo(x * currentCellSize, y * currentCellSize);
              ctx.lineTo(x * currentCellSize, (y + 1) * currentCellSize);
              ctx.stroke();
            }
          });
        });

        // Draw start indicator
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(currentCellSize / 2, currentCellSize / 2, currentCellSize / 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw finish indicator
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc((currentWidth - 0.5) * currentCellSize, (currentHeight - 0.5) * currentCellSize, currentCellSize / 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw solution
        if (showSolution) {
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(currentCellSize / 2, currentCellSize / 2);
          solution.forEach(([x, y]) => {
            ctx.lineTo(x * currentCellSize + currentCellSize / 2, y * currentCellSize + currentCellSize / 2);
          });
          ctx.stroke();
        }
      }
      
      // Call the drawMaze function
      drawMaze(ctx, maze, showSolution, solution, currentCellSize, currentWidth, currentHeight);
      
      // Print and close
      setTimeout(() => {
        window.print();
        window.close();
      }, 500);
    `);
      printWindow.document.write("</script>");
      printWindow.document.write("</body></html>");
      printWindow.document.close();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawMaze(
      ctx,
      maze,
      showSolution,
      solution,
      currentCellSize,
      currentWidth,
      currentHeight
    );
  }, [
    maze,
    showSolution,
    solution,
    currentWidth,
    currentHeight,
    currentCellSize,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Maze Generator</title>
        <meta name="description" content="High-performance maze generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Maze Generator
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                min="5"
                max="500"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                min="5"
                max="500"
              />
            </div>
            <div>
              <Label htmlFor="cellSize">Cell Size</Label>
              <Input
                id="cellSize"
                type="number"
                value={cellSize}
                onChange={(e) => setCellSize(parseInt(e.target.value))}
                min="5"
                max="100"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <Button onClick={generateMaze}>Generate New Maze</Button>
            <Button onClick={printMaze}>Print Maze</Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-solution"
                checked={showSolution}
                onCheckedChange={setShowSolution}
              />
              <Label htmlFor="show-solution">Show Solution</Label>
            </div>
          </div>

          <div className="flex max-w-full p-4 overflow-auto">
            <canvas
              ref={canvasRef}
              width={currentWidth * currentCellSize}
              height={currentHeight * currentCellSize}
              className="border border-black mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeGenerator;
