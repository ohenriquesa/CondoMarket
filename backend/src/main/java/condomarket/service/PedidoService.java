package condomarket.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import condomarket.model.ItemPedido;
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

    @Transactional
    public Pedido salvar(Pedido pedido) {
        vincularItens(pedido);
        return repository.save(pedido);
    }

    @Transactional
    public Optional<Pedido> atualizar(Long id, Pedido pedidoAtualizado) {
        return repository.findById(id).map(pedido -> {
            pedido.setDescricao(pedidoAtualizado.getDescricao());
            pedido.setValor(pedidoAtualizado.getValor());
            pedido.setStatus(pedidoAtualizado.getStatus());
            if (pedidoAtualizado.getUsuario() != null) {
                pedido.setUsuario(pedidoAtualizado.getUsuario());
            }
            if (pedidoAtualizado.getItens() != null) {
                if (pedido.getItens() == null) {
                    pedido.setItens(new ArrayList<>());
                }
                pedido.getItens().clear();
                pedido.getItens().addAll(pedidoAtualizado.getItens());
                vincularItens(pedido);
            }
            return repository.save(pedido);
        });
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    private void vincularItens(Pedido pedido) {
        if (pedido.getItens() == null) {
            return;
        }
        for (ItemPedido item : pedido.getItens()) {
            item.setPedido(pedido);
        }
    }
}