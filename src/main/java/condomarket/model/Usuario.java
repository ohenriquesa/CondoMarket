package condomarket.model;

import jakarta.persistence.*;
import condomarket.enums.EnumTipoUsuario;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;
    private String apartamento;

    @Enumerated(EnumType.STRING)
    private EnumTipoUsuario tipo;

    public Usuario() {}

    public Long getId() { return id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getApartamento() { return apartamento; }
    public void setApartamento(String apartamento) { this.apartamento = apartamento; }

    public EnumTipoUsuario getTipo() { return tipo; }
    public void setTipo(EnumTipoUsuario tipo) { this.tipo = tipo; }
}