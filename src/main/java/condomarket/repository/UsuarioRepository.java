package condomarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import condomarket.model.Usuario;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findByNomeContainingIgnoreCase(String nome);
}