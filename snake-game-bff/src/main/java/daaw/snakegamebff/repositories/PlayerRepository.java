package daaw.snakegamebff.repositories;

import daaw.snakegamebff.models.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Integer> {

    // Buscar per nom (id)
    Optional<Player> findByName(String name);

    // Eliminar jugador pel seu nom
    void deleteByName(String name);

}
