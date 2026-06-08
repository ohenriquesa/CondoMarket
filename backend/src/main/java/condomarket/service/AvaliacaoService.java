package condomarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import condomarket.model.Avaliacao;
import condomarket.repository.AvaliacaoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository repository;

    public List<Avaliacao> listar() {
        return repository.findAll();
    }

    public List<Avaliacao> listarPorProduto(Long idProduto) {
        return repository.findByProduto_IdProduto(idProduto);
    }

    public List<Avaliacao> listarPorPedido(Long idPedido) {
        return repository.findByPedido_Id(idPedido);
    }

    public Optional<Avaliacao> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Avaliacao salvar(Avaliacao avaliacao) {
        return repository.save(avaliacao);
    }

    public Optional<Avaliacao> atualizar(Long id, Avaliacao avaliacaoAtualizada) {
        return repository.findById(id).map(avaliacaoExistente -> {
            avaliacaoExistente.setNota(avaliacaoAtualizada.getNota());
            avaliacaoExistente.setComentario(avaliacaoAtualizada.getComentario());
            avaliacaoExistente.setPedido(avaliacaoAtualizada.getPedido());
            avaliacaoExistente.setUsuario(avaliacaoAtualizada.getUsuario());
            avaliacaoExistente.setProduto(avaliacaoAtualizada.getProduto());
            return repository.save(avaliacaoExistente);
        });
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}