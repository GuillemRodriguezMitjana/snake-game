import { useEffect, useState } from "react";

// API Client
import apiClient from "../api";

// Estils
import "./TopScores.css";

const TopScores = () => {
    // Carregar estats inicials
    const [topScores, setTopScores] = useState([]);
    const [loading, setLoading] = useState(true);

    // Obtenir top dels jugadors en funció de la seva puntuació màxima
    useEffect(() => {
        // Funció per obtenir la llista ordenada de la API
        const fetchTopScores = async () => {
            try {
                const response = await apiClient.get("/top-scores");
                setTopScores(response.data);
            } catch (error) {
                console.error("Error fetching top scores:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopScores();
    }, []);

    // Mostrar missatge de càrrega mentre s'obtenen els jugadors
    if (loading) {
        return <div>Loading...</div>;
    }

    // Si no hi ha cap jugador amb puntuacions, mostrar un missatge
    if (topScores.length === 0) {
        return <div>No scores available yet!</div>;
    }

    return (
        <div className="top-scores">
            <h2>Top Scores</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {topScores.map((player, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{player.name}</td>
                            <td>{player.bestScore}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TopScores;
