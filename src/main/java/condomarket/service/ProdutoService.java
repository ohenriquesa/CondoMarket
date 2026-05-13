package condomarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import condomarket.model.Produto;
import condomarket.repository.ProdutoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    public List<Produto> listar() {
        return repository.findAll();
    }

    public Optional<Produto> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Produto salvar(Produto produto) {
        return repository.save(produto);
    }

    public Optional<Produto> atualizar(Long id, Produto produtoAtualizado) {
        return repository.findById(id).map(produtoExistente -> {
            produtoExistente.setNome(produtoAtualizado.getNome());
            produtoExistente.setDescricao(produtoAtualizado.getDescricao());
            produtoExistente.setPreco(produtoAtualizado.getPreco());
            produtoExistente.setFoto(produtoAtualizado.getFoto());
            produtoExistente.setCategoria(produtoAtualizado.getCategoria());
            produtoExistente.setUsuario(produtoAtualizado.getUsuario());
            return repository.save(produtoExistente);
        });
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
    
    public List<Produto> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }
}