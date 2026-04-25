package condomarket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import condomarket.model.Avaliacao;
import condomarket.service.AvaliacaoService;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService service;

    @GetMapping
    public List<Avaliacao> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Avaliacao> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Avaliacao salvar(@RequestBody Avaliacao avaliacao) {
        return service.salvar(avaliacao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Avaliacao> atualizar(@PathVariable Long id, @RequestBody Avaliacao avaliacaoAtualizada) {
        return service.atualizar(id, avaliacaoAtualizada)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}