package condomarket.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import condomarket.model.Pedido;
import condomarket.repository.PedidoRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository repository;

    public List<Pedido> listar() {
        return repository.findAll();
    }

    public Optional<Pedido> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Pedido salvar(Pedido pedido) {
        return repository.save(pedido);
    }

    public Optional<Pedido> atualizar(Long id, Pedido pedidoAtualizado) {
        return repository.findById(id).map(pedido -> {
            pedido.setDescricao(pedidoAtualizado.getDescricao());
            pedido.setValor(pedidoAtualizado.getValor());
            pedido.setStatus(pedidoAtualizado.getStatus());
            if (pedidoAtualizado.getUsuario() != null) {
                pedido.setUsuario(pedidoAtualizado.getUsuario());
            }
            return repository.save(pedido);
        });
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}