package condomarket.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import condomarket.enums.EnumTipoUsuario;
import condomarket.model.Usuario;
import condomarket.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Optional<Usuario> autenticar(String email, String senha) {
        String emailNormalizado = normalizarEmail(email);
        if (emailNormalizado.isBlank() || senha == null || senha.isBlank()) {
            return Optional.empty();
        }

        return repository.findByEmailIgnoreCase(emailNormalizado)
                .filter(usuario -> senha.equals(usuario.getSenha()));
    }

    public Usuario cadastrar(Usuario usuario) {
        if (usuario.getTipo() == EnumTipoUsuario.ADMIN) {
            throw new IllegalArgumentException("Não é possível criar usuário admin pelo cadastro.");
        }
        return salvar(usuario);
    }

    public Usuario salvar(Usuario usuario) {
        validarUsuario(usuario, null, null);
        return repository.save(usuario);
    }

    public Optional<Usuario> atualizar(Long id, Usuario usuarioAtualizado) {
        return repository.findById(id).map(usuario -> {
            validarUsuario(usuarioAtualizado, id, usuario);
            usuario.setNome(usuarioAtualizado.getNome().trim());
            usuario.setEmail(normalizarEmail(usuarioAtualizado.getEmail()));
            if (usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isBlank()) {
                usuario.setSenha(usuarioAtualizado.getSenha());
            }
            usuario.setApartamento(usuarioAtualizado.getApartamento());
            usuario.setTipo(usuario.getTipo() == EnumTipoUsuario.ADMIN ? EnumTipoUsuario.ADMIN : usuarioAtualizado.getTipo());
            return repository.save(usuario);
        });
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public List<Usuario> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }

    private void validarUsuario(Usuario usuario, Long idAtual, Usuario usuarioExistente) {
        if (usuario.getNome() == null || usuario.getNome().trim().isBlank()) {
            throw new IllegalArgumentException("Informe o nome do usuário.");
        }
        if (usuario.getEmail() == null || normalizarEmail(usuario.getEmail()).isBlank()) {
            throw new IllegalArgumentException("Informe o email do usuário.");
        }
        if (idAtual == null && (usuario.getSenha() == null || usuario.getSenha().isBlank())) {
            throw new IllegalArgumentException("Informe a senha do usuário.");
        }
        if (usuario.getTipo() == null) {
            throw new IllegalArgumentException("Informe o tipo do usuário.");
        }

        boolean atualizandoAdminPadrao = usuarioExistente != null && usuarioExistente.getTipo() == EnumTipoUsuario.ADMIN;
        if (usuario.getTipo() == EnumTipoUsuario.ADMIN && !atualizandoAdminPadrao) {
            throw new IllegalArgumentException("Só existe o admin padrão do sistema.");
        }

        String emailNormalizado = normalizarEmail(usuario.getEmail());
        repository.findByEmailIgnoreCase(emailNormalizado).ifPresent(usuarioComEmail -> {
            if (idAtual == null || !usuarioComEmail.getId().equals(idAtual)) {
                throw new IllegalArgumentException("Este email já está cadastrado.");
            }
        });

        usuario.setNome(usuario.getNome().trim());
        usuario.setEmail(emailNormalizado);
    }

    private String normalizarEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}