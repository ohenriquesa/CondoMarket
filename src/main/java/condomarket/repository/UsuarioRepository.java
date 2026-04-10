package condomarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import condomarket.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}