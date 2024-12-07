/* eslint-disable react-hooks/exhaustive-deps */
// src/components/GameBoard.js

import { useState, useEffect } from 'react';
import './GameBoard.css';

const boardSize = 10;
const initialSnake = [{ x: 2, y: 2 }];
const initialFood = { x: 5, y: 5 };

const GameBoard = () => {
    const [snake, setSnake] = useState(initialSnake);
    const [food, setFood] = useState(initialFood);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);

    const [score, setScore] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (countdown === 0) setGameStarted(true);
        else {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    const restartGame = () => {
        setSnake(initialSnake);
        setFood(initialFood);
        setDirection({ x: 1, y: 0 });
        setGameOver(false);
        setScore(0);
        setCountdown(3);
        setGameStarted(false);
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    setDirection({ x: 1, y: 0 });
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (gameOver || !gameStarted) return;

        const moveSnake = () => {
            const newSnake = [...snake];
            const head = newSnake[0];
            const newHead = { x: head.x + direction.x, y: head.y + direction.y };

            // Check for collisions
            if (
                newHead.x < 0 ||
                newHead.y < 0 ||
                newHead.x >= boardSize ||
                newHead.y >= boardSize ||
                newSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
            ) {
                setGameOver(true);
                return;
            }

            newSnake.unshift(newHead);

            // Check for food
            if (newHead.x === food.x && newHead.y === food.y) {
                setFood({
                    x: Math.floor(Math.random() * boardSize),
                    y: Math.floor(Math.random() * boardSize)
                });
                setScore(score + 1);
            } else {
                newSnake.pop();
            }

            setSnake(newSnake);
        };

        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [snake, direction, food, gameOver, gameStarted]);

    const getHeadDirectionClass = () => {
        if (direction.y === -1) return "up";
        if (direction.y === 1) return "down";
        if (direction.x === 1) return "right";
        if (direction.x === -1) return "left";
        return "";
    }

    return (
        <div className="board">
            {countdown > 0 && !gameStarted && (
                <div className="countdown">{countdown}</div>
            )}
            <div className="score">Score: {score}</div>
            {Array.from({ length: boardSize }).map((_, row) =>
                Array.from({ length: boardSize }).map((_, col) => (
                    <div
                        key={`${row}-${col}`}
                        className={`cell ${
                            snake.some((segment, index) => segment.x === col && segment.y === row && index === 0)
                                ? `snake head ${getHeadDirectionClass()}`
                                : snake.some((segment, index) => segment.x === col && segment.y === row && index !== 0)
                                ? 'snake'
                                : food.x === col && food.y === row
                                ? 'food'
                                : ''
                        }`}
                    />
                ))
            )}
            {gameOver && 
                <div className="game-over">
                    <div>Game Over</div>
                    <button onClick={restartGame}>
                    <i className="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                </div>
            }
        </div>
    );
};

export default GameBoard;
