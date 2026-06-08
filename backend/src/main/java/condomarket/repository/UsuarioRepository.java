package condomarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import condomarket.enums.EnumTipoUsuario;
import condomarket.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findByNomeContainingIgnoreCase(String nome);

    Optional<Usuario> findByEmailIgnoreCase(String email);

    List<Usuario> findByTipo(EnumTipoUsuario tipo);
}