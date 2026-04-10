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

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}