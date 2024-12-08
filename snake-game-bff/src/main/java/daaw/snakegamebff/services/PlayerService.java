package daaw.snakegamebff.services;

import daaw.snakegamebff.models.Player;
import daaw.snakegamebff.repositories.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    /**
     * Funció per afegir un nou jugador.
     * @param player Jugador a afegir (nom i puntuacions inicials)
     * @return Jugador afegit
     */
    public Player createPlayer(Player player) {
        return playerRepository.save(player);
    }

    /**
     * Funció per afegir una nova puntuació a un jugador existent o no. Si no existeix, el crea.
     * @param playerName Nom del jugador
     * @param score Puntuació a afegir
     * @return Jugador actualitzat
     */
    public Player addScore(String playerName, int score) {
        // Buscar jugador a partir del nom
        Optional<Player> optionalPlayer = playerRepository.findByName(playerName);

        // Crear nou en cas de no existir i afegir la puntuació
        Player player = optionalPlayer.orElseGet(() -> new Player(playerName));
        player.addScore(score);

        return playerRepository.save(player);
    }

    /**
     * Funció per obtenir les dades d'un jugador a partir del seu nom.
     * @param playerName Nom del jugador
     * @return Jugador (opcional)
     */
    public Optional<Player> getPlayerByName(String playerName) {
        return playerRepository.findByName(playerName);
    }

    /**
     * Funció per obtenir tots els jugadors.
     * @return Llista amb els jugadors
     */
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    /**
     * Funció per obtenir els jugadors ordenats per la seva millor puntuació (descendent)
     * @return Llista de jugadors ordenada per puntuació
     */
    public List<Player> getTopPlayers() {
        // Obtenir tots els jugadors
        List<Player> players = playerRepository.findAll();

        // Ordernar-los per la millor puntuació de manera descendent
        players.sort((player1, player2) -> Integer.compare(player2.getBestScore(), player1.getBestScore()));

        return players;
    }

}
