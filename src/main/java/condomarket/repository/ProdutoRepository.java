package condomarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import condomarket.model.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}