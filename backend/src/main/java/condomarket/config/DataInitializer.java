package condomarket.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import condomarket.enums.EnumTipoUsuario;
import condomarket.model.Usuario;
import condomarket.repository.UsuarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;

    public DataInitializer(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) {
        Usuario admin = usuarioRepository.findByEmailIgnoreCase("admin@email.com")
                .orElseGet(() -> usuarioRepository.findByTipo(EnumTipoUsuario.ADMIN).stream().findFirst().orElseGet(Usuario::new));

        admin.setNome("Administrador");
        admin.setEmail("admin@email.com");
        admin.setSenha("123456");
        admin.setApartamento("Admin");
        admin.setTipo(EnumTipoUsuario.ADMIN);
        usuarioRepository.save(admin);
    }
}