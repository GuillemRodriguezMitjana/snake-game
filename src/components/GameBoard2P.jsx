import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ref, onValue, set } from "firebase/database";

// Base de dades firebase
import database from "../firebase";

// Estils
import "./GameBoard2P.css";

// Mida del tauler
const boardSize = 21;

// Estat inicial
const initialState = {
    snake1: [{ x: 2, y: 2 }],
    snake2: [{ x: boardSize - 2, y: boardSize - 2 }],
    food: { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) },
    direction1: { x: 1, y: 0 },
    direction2: { x: -1, y: 0 },
    score1: 0,
    score2: 0,
    gameOver: false,
    gameStarted: false,
    countdown: 3,
}

const GameBoard2P = ({ player }) => {
    // Carregar estat inicial
    const [state, setState] = useState(initialState);
    const [turning, setTurning] = useState(false);

    // Obtenir estat de firebase i subscriure's per obtenir nous canvis
    useEffect(() => {
        const stateRef = ref(database, "gameState");
        const unsubscribe = onValue(stateRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setState(data);
            }
        });

        return () => unsubscribe();
    }, []);

    // Funció per actualitzar l'estat a firebase
    const updateStateInFirebase = (newState) => {
        const stateRef = ref(database, "gameState");
        set(stateRef, newState);
    };

    // Funció per reiniciar el joc
    const restartGame = () => {
        updateStateInFirebase(initialState);
    };

    // Countdown inicial de 3 segons
    useEffect(() => {
        if (state.countdown === 0) updateStateInFirebase({ ...state, gameStarted: true });
        else {
            const timer = setInterval(() => {
                updateStateInFirebase({ ...state, countdown: state.countdown - 1 });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [state]);

    // Gestionar les tecles per a les serps
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (turning) return;
            else setTurning(true);

            if (player === "1") {
                switch (e.key) {
                    case "ArrowUp":
                        if (state.snake1.length === 1 || state.direction1.y === 0) {
                            updateStateInFirebase({ ...state, direction1: { x: 0, y: -1 } });
                        }
                        break;
                    case "ArrowDown":
                        if (state.snake1.length === 1 || state.direction1.y === 0) {
                            updateStateInFirebase({ ...state, direction1: { x: 0, y: 1 } });
                        }
                        break;
                    case "ArrowLeft":
                        if (state.snake1.length === 1 || state.direction1.x === 0) {
                            updateStateInFirebase({ ...state, direction1: { x: -1, y: 0 } });
                        }
                        break;
                    case "ArrowRight":
                        if (state.snake1.length === 1 || state.direction1.x === 0) {
                            updateStateInFirebase({ ...state, direction1: { x: 1, y: 0 } });
                        }
                        break;
                    default:
                }
            } else if (player === "2") {
                switch (e.key) {
                    case "ArrowUp":
                        if (state.snake2.length === 1 || state.direction2.y === 0) {
                            updateStateInFirebase({ ...state, direction2: { x: 0, y: -1 } });
                        }
                        break;
                    case "ArrowDown":
                        if (state.snake2.length === 1 || state.direction2.y === 0) {
                            updateStateInFirebase({ ...state, direction2: { x: 0, y: 1 } });
                        }
                        break;
                    case "ArrowLeft":
                        if (state.snake2.length === 1 || state.direction2.x === 0) {
                            updateStateInFirebase({ ...state, direction2: { x: -1, y: 0 } });
                        }
                        break;
                    case "ArrowRight":
                        if (state.snake2.length === 1 || state.direction2.x === 0) {
                            updateStateInFirebase({ ...state, direction2: { x: 1, y: 0 } });
                        }
                        break;
                    default:
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [player, state, turning]);

    // Gestionar moviment de les serps i comprovar col·lisions
    useEffect(() => {
        if (state.gameOver || !state.gameStarted) return;

        // Funció per moure les serps
        const moveSnakes = () => {
            const newState = { ...state };

            // Moure la serp del jugador 1
            const newSnake1 = [...newState.snake1];
            const head1 = newSnake1[0];
            const newHead1 = { x: head1.x + newState.direction1.x, y: head1.y + newState.direction1.y };

            // Comprovar col·lisions per la serp 1
            if (
                newHead1.x < 0 ||
                newHead1.y < 0 ||
                newHead1.x >= boardSize ||
                newHead1.y >= boardSize ||
                newSnake1.some((segment) => segment.x === newHead1.x && segment.y === newHead1.y) ||
                newState.snake2.some((segment) => segment.x === newHead1.x && segment.y === newHead1.y)
            ) {
                updateStateInFirebase({ ...newState, gameOver: true });
                return;
            }

            newSnake1.unshift(newHead1);

            // Comprovar menjar per la serp 1
            if (newHead1.x === newState.food.x && newHead1.y === newState.food.y) {
                newState.food = {
                x: Math.floor(Math.random() * boardSize),
                y: Math.floor(Math.random() * boardSize),
                };
                newState.score1 += 1;
            } else {
                newSnake1.pop();
            }

            newState.snake1 = newSnake1;

            // Moure la serp del jugador 2
            const newSnake2 = [...newState.snake2];
            const head2 = newSnake2[0];
            const newHead2 = { x: head2.x + newState.direction2.x, y: head2.y + newState.direction2.y };

            // Comprovar col·lisions per la serp 2
            if (
                newHead2.x < 0 ||
                newHead2.y < 0 ||
                newHead2.x >= boardSize ||
                newHead2.y >= boardSize ||
                newSnake2.some((segment) => segment.x === newHead2.x && segment.y === newHead2.y) ||
                newState.snake1.some((segment) => segment.x === newHead2.x && segment.y === newHead2.y)
            ) {
                updateStateInFirebase({ ...newState, gameOver: true });
                return;
            }

            newSnake2.unshift(newHead2);

            // Comprovar menjar per la serp 2
            if (newHead2.x === newState.food.x && newHead2.y === newState.food.y) {
                newState.food = {
                x: Math.floor(Math.random() * boardSize),
                y: Math.floor(Math.random() * boardSize),
                };
                newState.score2 += 1;
            } else {
                newSnake2.pop();
            }

            newState.snake2 = newSnake2;

            // Actualitzar l'estat a firebase
            updateStateInFirebase(newState);

            setTurning(false);
        };

        const interval = setInterval(moveSnakes, 200);
        return () => clearInterval(interval);
    }, [state]);

    // Funció per obtenir la direcció de la serp 'i'
    const getHeadDirectionClass = (i) => {
        if (state[`direction${i}`].y === -1) return "head up";
        if (state[`direction${i}`].y === 1) return "head down";
        if (state[`direction${i}`].x === 1) return "head right";
        if (state[`direction${i}`].x === -1) return "head left";
        return "";
    }

    return (
        <div>
            <h3 className={`player-title-${player}`}>Player {player}</h3>
            <div className="board-2p">
                {state.countdown > 0 && !state.gameStarted && 
                    <div className="countdown">
                        {state.countdown}
                    </div>
                }
                <div className="score-2p">
                    <p>Player 1: <span className="score-1">{state.score1}</span></p>
                    <p>Player 2: <span className="score-2">{state.score2}</span></p>
                </div>
                {Array.from({ length: boardSize }).map((_, row) =>
                    Array.from({ length: boardSize }).map((_, col) => {
                    const isSnake1 = state.snake1.some((segment) => segment.x === col && segment.y === row);
                    const isSnake2 = state.snake2.some((segment) => segment.x === col && segment.y === row);
                    const isFood = state.food.x === col && state.food.y === row;

                    return (
                        <div
                            key={`${row}-${col}`}
                            className={`cell ${
                                isSnake1
                                ? `snake1 ${row === state.snake1[0].y && col === state.snake1[0].x ? getHeadDirectionClass(1) : ""}`
                                : isSnake2
                                ? `snake2 ${row === state.snake2[0].y && col === state.snake2[0].x ? getHeadDirectionClass(2) : ""}`
                                : isFood
                                ? "food"
                                : ""
                            }`}
                        />
                    );
                    })
                )}
                {state.gameOver && (
                    <div className="game-over">
                        <div>Game Over</div>
                        <button onClick={restartGame}>
                            <i className="fa-solid fa-arrow-rotate-left"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Validar variable 'player' per a que sigui 1 o 2
GameBoard2P.propTypes = {
    player: PropTypes.oneOf(["1", "2"]).isRequired,
}

export default GameBoard2P;
