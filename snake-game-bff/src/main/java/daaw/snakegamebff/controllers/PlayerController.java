package daaw.snakegamebff.controllers;

import daaw.snakegamebff.models.Player;
import daaw.snakegamebff.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/v1/player")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    /**
     * Endpoint per crear un nou jugador.
     * @param player Jugador (nom i puntuacions inicials)
     * @return Jugador creat
     */
    @PostMapping("/create")
    public ResponseEntity<Player> createPlayer(@RequestBody Player player) {
        Player createdPlayer = playerService.createPlayer(player);
        return new ResponseEntity<>(createdPlayer, HttpStatus.CREATED);
    }

    /**
     * Endpoint per afegir una puntuació a un jugador existent o no. Si no existeix, el crea.
     * @param playerName Nom del jugador
     * @param score Puntuació a afegir
     * @return Jugador actualitzat
     */
    @PutMapping("/score")
    public ResponseEntity<Player> addScore(@RequestParam String playerName, @RequestParam int score) {
        Player updatedPlayer = playerService.addScore(playerName, score);
        return ResponseEntity.ok(updatedPlayer);
    }

    /**
     * Endpoint per obtenir un jugador pel seu nom.
     * @param name Nom del jugador
     * @return Jugador
     */
    @GetMapping("/{name}")
    public ResponseEntity<Player> getPlayer(@PathVariable String name) {
        Optional<Player> player = playerService.getPlayerByName(name);
        return player.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint per obtenir tots els jugadors.
     * @return Llista dels jugadors
     */
    @GetMapping("/all")
    public ResponseEntity<List<Player>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    /**
     * Endpoint per obtenir tots els jugadors ordenats descendentment per la seva millor puntuació.
     * @return Llista de jugadors ordenada per millor puntuació
     */
    @GetMapping("/top-scores")
    public ResponseEntity<List<Player>> getTopPlayers() {
        return ResponseEntity.ok(playerService.getTopPlayers());
    }

}
