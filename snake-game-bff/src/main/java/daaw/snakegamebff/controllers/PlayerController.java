package daaw.snakegamebff.controllers;

import daaw.snakegamebff.models.Player;
import daaw.snakegamebff.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/v1/player")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @PostMapping("/create")
    public Player createPlayer(@RequestBody Player player) {
        return playerService.createPlayer(player);
    }

    @PostMapping("/score")
    public Player addScore(@RequestParam String playerName, @RequestParam int score) {
        return playerService.addScore(playerName, score);
    }

    @GetMapping("/{name}")
    public Player getPlayer(@PathVariable String name) {
        return playerService.getPlayer(name);
    }

    @GetMapping("/all")
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers();
    }

}
