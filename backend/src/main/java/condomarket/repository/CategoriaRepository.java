package condomarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import condomarket.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}