"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"

type Difficulty = "easy" | "medium" | "hard"
type CellState = "hidden" | "revealed" | "flagged"
type GameState = "playing" | "won" | "lost"

interface Cell {
  isMine: boolean
  neighborCount: number
  state: CellState
}

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
}

export function Minesweeper() {
  const { t } = useLanguage()
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameState, setGameState] = useState<GameState>("playing")
  const [flagCount, setFlagCount] = useState(0)
  const [time, setTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const { rows, cols, mines } = DIFFICULTIES[difficulty]

  const initializeBoard = useCallback(() => {
    const newBoard: Cell[][] = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            neighborCount: 0,
            state: "hidden" as CellState,
          })),
      )

    // Place mines randomly
    let minesPlaced = 0
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * cols)

      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    // Calculate neighbor counts
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr
              const newCol = col + dc
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && newBoard[newRow][newCol].isMine) {
                count++
              }
            }
          }
          newBoard[row][col].neighborCount = count
        }
      }
    }

    setBoard(newBoard)
    setGameState("playing")
    setFlagCount(0)
    setTime(0)
    setIsTimerRunning(false)
  }, [rows, cols, mines])

  useEffect(() => {
    initializeBoard()
  }, [initializeBoard])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && gameState === "playing") {
      interval = setInterval(() => {
        setTime((time) => time + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, gameState])

  const revealCell = (row: number, col: number) => {
    if (gameState !== "playing" || board[row][col].state !== "hidden") return

    if (!isTimerRunning) {
      setIsTimerRunning(true)
    }

    const newBoard = [...board]

    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].state = "revealed"
          }
        }
      }
      setGameState("lost")
      setIsTimerRunning(false)
    } else {
      // Reveal cell and potentially neighbors
      const toReveal: [number, number][] = [[row, col]]

      while (toReveal.length > 0) {
        const [currentRow, currentCol] = toReveal.pop()!

        if (
          currentRow < 0 ||
          currentRow >= rows ||
          currentCol < 0 ||
          currentCol >= cols ||
          newBoard[currentRow][currentCol].state !== "hidden"
        ) {
          continue
        }

        newBoard[currentRow][currentCol].state = "revealed"

        // If cell has no neighboring mines, reveal all neighbors
        if (newBoard[currentRow][currentCol].neighborCount === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              toReveal.push([currentRow + dr, currentCol + dc])
            }
          }
        }
      }

      // Check for win condition
      let hiddenNonMines = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!newBoard[r][c].isMine && newBoard[r][c].state === "hidden") {
            hiddenNonMines++
          }
        }
      }

      if (hiddenNonMines === 0) {
        setGameState("won")
        setIsTimerRunning(false)
      }
    }

    setBoard(newBoard)
  }

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault()
    if (gameState !== "playing" || board[row][col].state === "revealed") return

    const newBoard = [...board]
    if (newBoard[row][col].state === "hidden") {
      newBoard[row][col].state = "flagged"
      setFlagCount(flagCount + 1)
    } else if (newBoard[row][col].state === "flagged") {
      newBoard[row][col].state = "hidden"
      setFlagCount(flagCount - 1)
    }

    setBoard(newBoard)
  }

  const getCellContent = (cell: Cell) => {
    if (cell.state === "flagged") return "🚩"
    if (cell.state === "hidden") return ""
    if (cell.isMine) return "💣"
    if (cell.neighborCount === 0) return ""
    return cell.neighborCount.toString()
  }

  const getCellClassName = (cell: Cell) => {
    const base =
      "w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer select-none"

    if (cell.state === "hidden" || cell.state === "flagged") {
      return `${base} bg-gray-300 hover:bg-gray-200`
    }

    if (cell.isMine) {
      return `${base} bg-red-500 text-white`
    }

    const colors = [
      "",
      "text-blue-600",
      "text-green-600",
      "text-red-600",
      "text-purple-600",
      "text-yellow-600",
      "text-pink-600",
      "text-black",
      "text-gray-600",
    ]

    return `${base} bg-gray-100 ${colors[cell.neighborCount] || ""}`
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button variant={difficulty === "easy" ? "default" : "outline"} onClick={() => setDifficulty("easy")}>
            {t("game.easy")}
          </Button>
          <Button variant={difficulty === "medium" ? "default" : "outline"} onClick={() => setDifficulty("medium")}>
            {t("game.medium")}
          </Button>
          <Button variant={difficulty === "hard" ? "default" : "outline"} onClick={() => setDifficulty("hard")}>
            {t("game.hard")}
          </Button>
        </div>

        <Button onClick={initializeBoard}>{t("game.new_game")}</Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 items-center">
        <Badge variant="outline">
          {t("game.mines")}: {mines - flagCount}
        </Badge>
        <Badge variant="outline">
          {t("game.time")}: {time}s
        </Badge>
        {gameState === "won" && <Badge className="bg-green-500">{t("game.won")}</Badge>}
        {gameState === "lost" && <Badge variant="destructive">{t("game.lost")}</Badge>}
      </div>

      {/* Game Board */}
      <div className="inline-block border-2 border-gray-600 bg-gray-200 p-2">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClassName(cell)}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
              >
                {getCellContent(cell)}
              </div>
            )),
          )}
        </div>
      </div>

      {gameState !== "playing" && (
        <div className="text-center">
          <Button onClick={initializeBoard}>{t("game.play_again")}</Button>
        </div>
      )}
    </div>
  )
}
