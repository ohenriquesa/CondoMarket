package condomarket.model;

import jakarta.persistence.*;
import condomarket.enums.EnumStatusDePedido;

@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descricao;

    private Double valor;

    @Enumerated(EnumType.STRING) 
    private EnumStatusDePedido status;

    
    public Pedido() {
    }

    
    public Long getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public EnumStatusDePedido getStatus() {
        return status;
    }

    public void setStatus(EnumStatusDePedido status) {
        this.status = status;
    }
}