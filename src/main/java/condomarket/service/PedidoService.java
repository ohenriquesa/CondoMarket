package condomarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import condomarket.model.Pedido;
import condomarket.repository.PedidoRepository;

import java.util.List;
import java.util.Optional;

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
    return repository.findById(id).map(pedidoExistente -> {
        pedidoExistente.setStatus(pedidoAtualizado.getStatus());
        pedidoExistente.setUsuario(pedidoAtualizado.getUsuario());
        return repository.save(pedidoExistente);
    });
}

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}