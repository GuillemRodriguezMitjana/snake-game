package daaw.snakegamebff.models;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
public class Player {

    @Id
    private String name;

    @ElementCollection
    private final List<Integer> scores = new ArrayList<>();

    // Constructors
    public Player() {}

    public Player(String name) {
        this.name = name;
    }

    // Getters i Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Integer> getScores() {
        return scores;
    }

    public void addScore(int score) {
        this.scores.add(score);
    }

    /**
     * Funció per obtenir la millor puntuació d'una jugador.
     * @return Puntuació més alta
     */
    public int getBestScore() {
        if (scores.isEmpty()) return 0;
        return Collections.max(scores);
    }

}
