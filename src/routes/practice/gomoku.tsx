import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useState } from "react";

export const Route = createFileRoute("/practice/gomoku")({
  component: GomokuPage,
});

const SIZE = 15;
type Cell = "black" | "white" | null;
type Board = Cell[][];

function createBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}

function checkWin(board: Board, row: number, col: number, player: Cell): boolean {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    let count = 1;
    for (const sign of [1, -1]) {
      let r = row + dr * sign;
      let c = col + dc * sign;
      while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && board[r][c] === player) {
        count++;
        r += dr * sign;
        c += dc * sign;
      }
    }
    if (count >= 5) return true;
  }
  return false;
}

function GomokuPage() {
  const [board, setBoard] = useState<Board>(createBoard);
  const [current, setCurrent] = useState<"black" | "white">("black");
  const [winner, setWinner] = useState<Cell>(null);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (winner || board[row][col]) return;

      const next = board.map((r) => [...r]);
      next[row][col] = current;

      const won = checkWin(next, row, col, current);
      setBoard(next);
      setLastMove([row, col]);

      if (won) {
        setWinner(current);
      } else {
        setCurrent(current === "black" ? "white" : "black");
      }
    },
    [board, current, winner],
  );

  const reset = () => {
    setBoard(createBoard());
    setCurrent("black");
    setWinner(null);
    setLastMove(null);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">고누 (오목)</h1>
        <p className="text-[var(--color-muted)]">
          {winner
            ? `🎉 ${winner === "black" ? "흑" : "백"} 승리!`
            : `현재 차례: ${current === "black" ? "⚫ 흑" : "⚪ 백"}`}
        </p>
      </div>

      <div
        className="overflow-auto rounded-xl border border-[var(--color-border)] bg-amber-900/20 p-2"
        style={{ touchAction: "none" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${SIZE}, 1.75rem)`,
            gridTemplateRows: `repeat(${SIZE}, 1.75rem)`,
            gap: "1px",
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isLast = lastMove?.[0] === r && lastMove?.[1] === c;
              return (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: board coordinates are stable keys, not list indices
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => handleClick(r, c)}
                  className="relative flex h-7 w-7 items-center justify-center"
                  aria-label={`행 ${r + 1}, 열 ${c + 1}`}
                >
                  {/* Grid lines */}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="absolute h-px w-full bg-amber-700/60" />
                    <span className="absolute h-full w-px bg-amber-700/60" />
                  </span>
                  {cell && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`relative z-10 h-5 w-5 rounded-full shadow-md ${
                        cell === "black" ? "bg-gray-900 ring-1 ring-gray-600" : "bg-white ring-1 ring-gray-300"
                      } ${isLast ? "ring-2 ring-[var(--color-accent)]" : ""}`}
                    />
                  )}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={reset}
        className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]"
      >
        새 게임
      </button>
    </div>
  );
}
