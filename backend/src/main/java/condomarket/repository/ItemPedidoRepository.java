package condomarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import condomarket.model.ItemPedido;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
}