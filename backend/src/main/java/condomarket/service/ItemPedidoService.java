package condomarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import condomarket.model.ItemPedido;
import condomarket.repository.ItemPedidoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ItemPedidoService {

    @Autowired
    private ItemPedidoRepository repository;

    public List<ItemPedido> listar() {
        return repository.findAll();
    }

    public Optional<ItemPedido> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public ItemPedido salvar(ItemPedido itemPedido) {
        return repository.save(itemPedido);
    }

    public Optional<ItemPedido> atualizar(Long id, ItemPedido itemAtualizado) {
    return repository.findById(id).map(itemExistente -> {
        itemExistente.setQuantidade(itemAtualizado.getQuantidade());
        itemExistente.setPedido(itemAtualizado.getPedido());
        itemExistente.setProduto(itemAtualizado.getProduto());
        return repository.save(itemExistente);
    });
}

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}