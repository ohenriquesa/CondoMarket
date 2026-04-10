package condomarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import condomarket.model.Avaliacao;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
}