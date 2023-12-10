"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { randomString16 } from "@/src/Utils";
import "./index.scss";

type GameInfoType = {
  id: string;
  game: GamePlayType[];
  status: GameStatusType;
  history: {
    black: number;
    white: number;
  };
};

type GamePlayType = {
  sequence: number;
  player: "black" | "white";
  position: {
    row: number;
    col: number;
  };
};

type GameStatusType = "continue" | "black" | "white";

const boardSize = 15;

const PlayerInfo = ({ player, score }: { player: string; score: number }) => {
  return (
    <div>
      <span>{player} : </span>
      <span>{score}</span>
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
  const [winner, setWinner] = useState<"black" | "white" | null>(null);

  const [canvasStyleCSS, setCanvasStyleCSS] = useState<React.CSSProperties>({});

  const [gameInfo, setGameInfo] = useState<GameInfoType>({
    id: "",
    game: [],
    status: "continue",
    history: {
      black: 0,
      white: 0,
    },
  });

  const gameIdRef = useRef<string>("");

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleReset = () => {
    setIsLoading(true);
    const newGameId = randomString16();
    gameIdRef.current = newGameId;

    setGameInfo({ id: newGameId, game: [], status: "continue", history: { black: 0, white: 0 } });
    setCurrentPlayer("black");
    setWinner(null);
    setCanvasStyleCSS({});

    router.replace(pathname);

    drawInitBoard();
    setIsLoading(false);
  };

  const handleRestart = () => {
    setIsLoading(true);
    const newGameId = randomString16();
    gameIdRef.current = newGameId;
    const newGameInfo: GameInfoType = { id: newGameId, game: [], status: "continue", history: gameInfo.history };
    setGameInfo(newGameInfo);
    setCurrentPlayer("black");
    setWinner(null);
    setCanvasStyleCSS({});

    const stringifyGameInfo = btoa(JSON.stringify(newGameInfo));

    router.replace(pathname + "?" + createQueryString("game", stringifyGameInfo));

    if (typeof window !== "undefined") {
      localStorage.setItem("game", stringifyGameInfo);
    }

    drawInitBoard();
    setIsLoading(false);
  };

  const drawPreviewBoard = (ctx: CanvasRenderingContext2D) => {
    if (!canvasRef.current || !canvasRef.current.width || !canvasRef.current.height) {
      return;
    }

    const cellSize = canvasRef.current.width / boardSize;

    // Draw the board lines
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 2;

    for (let i = 1; i < boardSize; i++) {
      const position = i * cellSize;

      // Draw horizontal lines
      ctx.beginPath();
      ctx.moveTo(cellSize, position);
      ctx.lineTo(canvasRef.current.width - cellSize, position);
      ctx.stroke();

      // Draw vertical lines
      ctx.beginPath();
      ctx.moveTo(position, cellSize);
      ctx.lineTo(position, canvasRef.current.height - cellSize);
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
      if (board.length === 0 || !canvasRef.current || !canvasRef.current.width || !canvasRef.current.height) {
        return;
      }
      const cellSize = canvasRef.current.width / boardSize;

      // Draw the board lines
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.lineWidth = 2;

      for (let i = 1; i < boardSize; i++) {
        const position = i * cellSize;

        // Draw horizontal lines
        ctx.beginPath();
        ctx.moveTo(cellSize, position);
        ctx.lineTo(canvasRef.current.width - cellSize, position);
        ctx.stroke();

        // Draw vertical lines
        ctx.beginPath();
        ctx.moveTo(position, cellSize);
        ctx.lineTo(position, canvasRef.current.height - cellSize);
        ctx.stroke();
      }

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
    if (!canvasRef.current || !canvasRef.current.width || !canvasRef.current.height) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasRef.current.width, canvasRef.current.height);
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

      // Check for a winner
      const isWinner = checkForWinner(row, col);
      let winnerPlayer;
      if (isWinner) {
        winnerPlayer = currentPlayer;
        setWinner(winnerPlayer);

        setCanvasStyleCSS({ cursor: "default" });
      } else {
        // Switch player
        setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
      }

      // save game info
      const newGamePlay = [...(gameInfo.game || []), { sequence: (gameInfo.game || []).length + 1, player: currentPlayer, position: { row, col } }];
      const newGameInfo: GameInfoType = {
        id: gameIdRef.current || randomString16(),
        game: newGamePlay,
        status: isWinner ? currentPlayer : "continue",
        history: winnerPlayer
          ? winnerPlayer === "black"
            ? { black: gameInfo.history.black + 1, white: gameInfo.history.white }
            : { black: gameInfo.history.black, white: gameInfo.history.white + 1 }
          : gameInfo.history,
      };

      const stringifyGameInfo = btoa(JSON.stringify(newGameInfo));

      router.replace(pathname + "?" + createQueryString("game", stringifyGameInfo));

      if (typeof window !== "undefined") {
        localStorage.setItem("game", stringifyGameInfo);
      }

      setGameInfo(newGameInfo);

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

    return count === 5;
  };

  const drawInitBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    if (gameIdRef && !gameIdRef.current) {
      gameIdRef.current = randomString16();
    }

    // Initialize the board
    const initialBoard: string[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(""));
    setBoard(initialBoard);

    // Draw the initial board
    drawBoard(ctx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef.current]);

  useEffect(() => {
    drawInitBoard();

    if (board.length === 0) {
      return;
    }
    const stringifyGameInfo = searchParams.get("game") || localStorage.getItem("game");

    if (!stringifyGameInfo) {
      return;
    }

    const savedGameInfo: GameInfoType = JSON.parse(atob(stringifyGameInfo));

    if (savedGameInfo.game.length === 0) {
      return;
    }

    router.replace(pathname + "?" + createQueryString("game", stringifyGameInfo));

    savedGameInfo.game.forEach((stone) => {
      let newBoard = [...board];
      newBoard[stone.position.row][stone.position.col] = stone.player;
      setBoard(newBoard);
    });

    setCurrentPlayer(savedGameInfo.game[savedGameInfo.game.length - 1].player === "black" ? "white" : "black");
    gameIdRef.current = savedGameInfo.id || randomString16();

    setGameInfo(savedGameInfo);

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    drawBoard(ctx);
  }, [drawInitBoard]);

  return (
    <div className="gomokuGameBoardContainer">
      <canvas
        ref={canvasRef}
        className="gomokuGameBoard"
        width={Math.min(window.innerWidth, window.innerHeight) - 100} // Set your desired width
        height={Math.min(window.innerWidth, window.innerHeight) - 100} // Set your desired height
        style={{ ...canvasStyleCSS }}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />
      <PlayerInfo player={"black"} score={gameInfo.history.black} />
      <PlayerInfo player={"white"} score={gameInfo.history.white} />
      <Button onClick={handleReset}>전체 초기화</Button>
      <Button onClick={handleRestart}>게임 다시하기</Button>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading} onClick={() => setIsLoading(false)}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default GomokuContainer;
