package condomarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import condomarket.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}