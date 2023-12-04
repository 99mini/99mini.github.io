"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";

type GamePlayType = {
  sequence: number;
  player: "black" | "white";
  position: {
    row: number;
    col: number;
  };
};

const PlayerInfo = ({ player }: { player: string }) => {
  return (
    <div>
      <div>{player}</div>
    </div>
  );
};

const GomokuContainer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [board, setBoard] = useState<string[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"black" | "white">("black");
  const [previewPos, setPreviewPos] = useState<{ col: number; row: number }>({
    col: 0,
    row: 0,
  });
  const [winner, setWinner] = useState<string | null>(null);

  const [canvasStyleCSS, setCanvasStyleCSS] = useState<React.CSSProperties>({});

  const [gameInfo, setGameInfo] = useState<GamePlayType[]>([]);

  const boardSize = 15;

  const drawPreviewBoard = (ctx: CanvasRenderingContext2D) => {
    const cellSize = canvasRef.current?.width! / boardSize;

    // Draw the board lines
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 2;

    for (let i = 1; i < boardSize; i++) {
      const position = i * cellSize;

      // Draw horizontal lines
      ctx.beginPath();
      ctx.moveTo(cellSize, position);
      ctx.lineTo(canvasRef.current!.width - cellSize, position);
      ctx.stroke();

      // Draw vertical lines
      ctx.beginPath();
      ctx.moveTo(position, cellSize);
      ctx.lineTo(position, canvasRef.current!.height - cellSize);
      ctx.stroke();
    }

    // Draw stones on the board
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const stone = board[row][col];
        if (stone === "black") {
          drawStone(ctx, col, row, "black");
          continue;
        } else if (stone === "white") {
          drawStone(ctx, col, row, "white");
          continue;
        }

        if (row === previewPos.row && col === previewPos.col) {
          if (currentPlayer === "black") {
            drawStone(ctx, col, row, "rgba(33,33,33,0.3)");
          } else {
            drawStone(ctx, col, row, "rgba(255, 255, 255, 0.9)");
          }
        }
      }
    }
  };

  const drawBoard = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (board.length === 0) {
        return;
      }
      const cellSize = canvasRef.current?.width! / boardSize;

      // Draw the board lines
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.lineWidth = 2;

      for (let i = 1; i < boardSize; i++) {
        const position = i * cellSize;

        // Draw horizontal lines
        ctx.beginPath();
        ctx.moveTo(cellSize, position);
        ctx.lineTo(canvasRef.current!.width - cellSize, position);
        ctx.stroke();

        // Draw vertical lines
        ctx.beginPath();
        ctx.moveTo(position, cellSize);
        ctx.lineTo(position, canvasRef.current!.height - cellSize);
        ctx.stroke();
      }

      // Draw stones on the board
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          const stone = board[row][col];
          if (stone === "black") drawStone(ctx, col, row, "black");
          else if (stone === "white") drawStone(ctx, col, row, "white");
        }
      }

      // Draw the winner's line if there's a winner
      if (winner) {
        drawWinnerLine(ctx);
      }
    },
    [board, winner]
  );

  const drawStone = (ctx: CanvasRenderingContext2D, col: number, row: number, color: string, strokeColor: string = "rgb(0,0,0)") => {
    const cellSize = canvasRef.current!.width / boardSize;
    const centerX = col * cellSize + cellSize;
    const centerY = row * cellSize + cellSize;

    ctx.beginPath();
    ctx.arc(centerX, centerY, cellSize / 2 - 2, 0, 2 * Math.PI);
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  };

  const drawWinnerLine = (ctx: CanvasRenderingContext2D) => {
    // Draw the winning line based on your game logic
    // This is just a placeholder, you should implement the actual winning line drawing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasRef.current!.width, canvasRef.current!.height);
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.lineWidth = 5;
    ctx.stroke();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || winner) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const cellSize = canvas.width / boardSize;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (col >= boardSize - 1 || row >= boardSize - 1) {
      return;
    }

    // Check if the cell is empty
    if (board[row][col] === "") {
      // Update the board state
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);

      // save game info
      const newGameInfo = [...gameInfo, { sequence: gameInfo.length + 1, player: currentPlayer, position: { row, col } }];
      const stringifyGameInfo = btoa(JSON.stringify({ game: newGameInfo }));
      console.log(JSON.parse(atob(stringifyGameInfo)));
      const url = new URL(window.location.href);
      url.searchParams.set("game", stringifyGameInfo);

      window.history.pushState({}, "", url);
      setGameInfo(newGameInfo);
      // Check for a winner
      const isWinner = checkForWinner(row, col);
      if (isWinner) {
        setWinner(currentPlayer);
        setCanvasStyleCSS({ cursor: "default" });
      } else {
        // Switch player
        setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
      }

      // Redraw the board
      const ctx = canvas.getContext("2d");

      if (ctx) {
        drawBoard(ctx);
      }
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || winner) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const cellSize = canvas.width / boardSize;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (col >= boardSize - 1 || row >= boardSize - 1) {
      return;
    }

    setPreviewPos({ col, row });

    // Check if the cell is empty
    if (board[row][col] === "") {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawPreviewBoard(ctx);
      }
    }
  };

  const checkForWinner = (row: number, col: number): boolean => {
    // Implement your winning condition logic here
    // This is just a placeholder, you should customize it based on your game rules

    // For example, checking horizontal, vertical, and diagonal lines
    const horizontalWin = checkLine(row, col, 0, 1);
    const verticalWin = checkLine(row, col, 1, 0);
    const diagonalWin1 = checkLine(row, col, 1, 1);
    const diagonalWin2 = checkLine(row, col, 1, -1);

    return horizontalWin || verticalWin || diagonalWin1 || diagonalWin2;
  };

  const checkLine = (startRow: number, startCol: number, rowIncrement: number, colIncrement: number): boolean => {
    const stoneColor = board[startRow][startCol];
    let count = 1; // Count the first stone

    // Check in one direction
    for (let i = 1; i < 5; i++) {
      const newRow = startRow + i * rowIncrement;
      const newCol = startCol + i * colIncrement;

      if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize || board[newRow][newCol] !== stoneColor) {
        break;
      }

      count++;
    }

    // Check in the opposite direction
    for (let i = 1; i < 5; i++) {
      const newRow = startRow - i * rowIncrement;
      const newCol = startCol - i * colIncrement;

      if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize || board[newRow][newCol] !== stoneColor) {
        break;
      }

      count++;
    }

    return count >= 5;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize the board
    const initialBoard: string[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
    setBoard(initialBoard);

    // Draw the initial board
    drawBoard(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef.current]);

  return (
    <div className="gomokuGameBoardContainer">
      <PlayerInfo player={"black"} />
      <canvas
        ref={canvasRef}
        className="gomokuGameBoard"
        width={window.innerWidth * 0.6} // Set your desired width
        height={window.innerWidth * 0.6} // Set your desired height
        style={{ ...canvasStyleCSS }}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />
      <PlayerInfo player={"white"} />
    </div>
  );
};

export default GomokuContainer;
