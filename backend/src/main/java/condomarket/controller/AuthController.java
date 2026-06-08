package condomarket.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import condomarket.model.Usuario;
import condomarket.service.UsuarioService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return service.autenticar(request.email(), request.senha())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos."));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(usuario));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    public record LoginRequest(String email, String senha) {}
}