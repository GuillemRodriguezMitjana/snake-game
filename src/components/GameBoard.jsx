import { useState, useEffect } from 'react';

// Estils
import "./GameBoard.css"

// Mida del tauler
const boardSize = 10;

// Estat inicial
const initialSnake = [{ x: 2, y: 2 }];
const initialFood = { x: 5, y: 5 };

const GameBoard = () => {
    // Carregar estat inicial
    const [snake, setSnake] = useState(initialSnake);
    const [food, setFood] = useState(initialFood);
    const [direction, setDirection] = useState({ x: 1, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);

    // Countdown inicial de 3 segons
    useEffect(() => {
        if (countdown === 0) setGameStarted(true);
        else {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    // Funció per reiniciar el joc
    const restartGame = () => {
        setSnake(initialSnake);
        setFood(initialFood);
        setDirection({ x: 1, y: 0 });
        setGameOver(false);
        setScore(0);
        setCountdown(3);
        setGameStarted(false);
    }

    // Gestionar les tecles per a la serp
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
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);
    
    // Gestionar moviment de la serp i comprovar col·lisions
    useEffect(() => {
        // Funció per generar una posició del menjar on no estigui la serp
        const generateFoodPosition = () => {
            let newFoodPosition;
            let isFoodOnSnake = true;
    
            while (isFoodOnSnake) {
                newFoodPosition = {
                    x: Math.floor(Math.random() * boardSize),
                    y: Math.floor(Math.random() * boardSize),
                }
    
                isFoodOnSnake = snake.some((segment) => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)
            }
    
            return newFoodPosition;
        }

        if (gameOver || !gameStarted) return;

        // Funció per moure la serp
        const moveSnake = () => {
            // Moure la serp
            const newSnake = [...snake];
            const head = newSnake[0];
            const newHead = { x: head.x + direction.x, y: head.y + direction.y };

            // Comprovar col·lisions
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

            // Comprovar menjar
            if (newHead.x === food.x && newHead.y === food.y) {
                setFood(generateFoodPosition());
                setScore(score + 1);
            } else {
                newSnake.pop();
            }

            // Actualitzar serp
            setSnake(newSnake);
        };

        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [snake, direction, food, gameOver, gameStarted, score]);

    // Funció per obtenir la direcció de la serp
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
