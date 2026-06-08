package condomarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import condomarket.model.Categoria;
import condomarket.model.Produto;
import condomarket.repository.CategoriaRepository;
import condomarket.repository.ProdutoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Categoria> listar() {
        return repository.findAll();
    }

    public Optional<Categoria> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Categoria salvar(Categoria categoria) {
        return repository.save(categoria);
    }

    public Optional<Categoria> atualizar(Long id, Categoria categoriaAtualizada) {
        return repository.findById(id).map(categoriaExistente -> {
            categoriaExistente.setNome(categoriaAtualizada.getNome());
            return repository.save(categoriaExistente);
        });
    }

    @Transactional
    public void deletar(Long id) {
        List<Produto> produtosVinculados = produtoRepository.findByCategoria_IdCategoria(id);
        produtosVinculados.forEach(produto -> produto.setCategoria(null));
        produtoRepository.saveAll(produtosVinculados);
        repository.deleteById(id);
    }
}