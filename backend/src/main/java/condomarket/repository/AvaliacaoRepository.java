package condomarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import condomarket.model.Avaliacao;

import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByProduto_IdProduto(Long idProduto);

    List<Avaliacao> findByPedido_Id(Long idPedido);
}