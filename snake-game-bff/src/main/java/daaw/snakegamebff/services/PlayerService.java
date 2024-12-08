package daaw.snakegamebff.services;

import daaw.snakegamebff.models.Player;
import daaw.snakegamebff.repositories.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    public Player createPlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player addScore(String playerName, int score) {
        Optional<Player> optionalPlayer = playerRepository.findByName(playerName);

        Player player = optionalPlayer.orElseGet(() -> new Player(playerName));
        player.addScore(score);

        return playerRepository.save(player);
    }

    public Player getPlayer(String playerName) {
        return playerRepository.findByName(playerName).orElse(null);
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

}
