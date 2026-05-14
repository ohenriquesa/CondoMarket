package condomarket.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Usuario salvar(Usuario usuario) {
        return repository.save(usuario);
    }

    public Optional<Usuario> atualizar(Long id, Usuario usuarioAtualizado) {
        return repository.findById(id).map(usuario -> {
            usuario.setNome(usuarioAtualizado.getNome());
            usuario.setEmail(usuarioAtualizado.getEmail());
            usuario.setSenha(usuarioAtualizado.getSenha());
            usuario.setApartamento(usuarioAtualizado.getApartamento());
            usuario.setTipo(usuarioAtualizado.getTipo());
            return repository.save(usuario);
        });
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public List<Usuario> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }
}