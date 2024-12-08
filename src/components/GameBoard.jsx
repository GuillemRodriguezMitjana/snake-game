import { useState, useEffect } from 'react';

// Estils
import "./GameBoard.css"

// Mida del tauler
const boardSize = 11;

// Funció per obtenir una posició aleatòria (vores excloses) diferent de 'pos'
const getRandomPosition = (pos = {x: 0, y: 0}) => {
    let randomPos = { x: 0, y: 0 }

    do {
        randomPos = {
            x: Math.floor(Math.random() * (boardSize - 2) + 1),
            y: Math.floor(Math.random() * (boardSize - 2) + 1),
        }
    } while (randomPos.x === pos.x && randomPos.y === pos.y);

    return randomPos;
};

// Funció per obtenir una direcció aleatòria
const getRandomDirection = () => {
    const directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
    ];
    return directions[Math.floor(Math.random() * directions.length)];
};

const GameBoard = () => {
    // Carregar estat inicial
    const [snake, setSnake] = useState([getRandomPosition()]);
    const [food, setFood] = useState(getRandomPosition(snake));
    const [direction, setDirection] = useState(getRandomDirection());
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [gameStarted, setGameStarted] = useState(false);
    const [turning, setTurning] = useState(false);
    const [gameWon, setGameWon] = useState(false);

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
        setSnake([getRandomPosition()]);
        setFood(getRandomPosition(snake));
        setDirection(getRandomDirection());
        setGameOver(false);
        setScore(0);
        setCountdown(3);
        setGameStarted(false);
        setTurning(false);
        setGameWon(false);
    }

    // Gestionar les tecles per a la serp
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (turning) return;
            else setTurning(true);

            switch (e.key) {
                case 'ArrowUp':
                    if (snake.length === 1 || direction.y === 0) setDirection({ x: 0, y: -1 });
                    break;
                case 'ArrowDown':
                    if (snake.length === 1 || direction.y === 0) setDirection({ x: 0, y: 1 });
                    break;
                case 'ArrowLeft':
                    if (snake.length === 1 || direction.x === 0) setDirection({ x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                    if (snake.length === 1 || direction.x === 0) setDirection({ x: 1, y: 0 });
                    break;
                default:
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [direction, snake, turning]);
    
    // Gestionar moviment de la serp i comprovar col·lisions
    useEffect(() => {
        // Funció per generar una posició del menjar on no estigui la serp
        const generateFoodPosition = (snake) => {
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

        if (gameOver || !gameStarted || gameWon) return;

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
                setFood(generateFoodPosition(newSnake));
                setScore(score + 1);

                if (score + 1 >= boardSize * boardSize) {
                    setGameWon(true);
                }
            } else {
                newSnake.pop();
            }

            // Actualitzar serp
            setSnake(newSnake);

            setTurning(false);
        };

        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [snake, direction, food, gameOver, gameStarted, score, gameWon]);

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
            {gameOver && !gameWon &&
                <div className="game-over">
                    <div>Game Over</div>
                    <button onClick={restartGame}>
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                </div>
            }
            {gameWon &&
                <div className="game-over">
                    <div>You Win!</div>
                    <button onClick={restartGame}>
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                    </button>
                </div>
            }
        </div>
    );
};

export default GameBoard;
