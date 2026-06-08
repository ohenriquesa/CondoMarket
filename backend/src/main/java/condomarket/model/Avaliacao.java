package condomarket.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAvaliacao;

    private Integer nota;
    private String comentario;

    @OneToOne
    @JoinColumn(name = "id_pedido")
    @JsonIgnoreProperties({"itens", "usuario"})
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"senha"})
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_produto")
    @JsonIgnoreProperties({"usuario", "categoria"})
    private Produto produto;

    public Long getIdAvaliacao() {
        return idAvaliacao;
    }
    public void setIdAvaliacao(Long idAvaliacao) {
        this.idAvaliacao = idAvaliacao;
    }

    public Integer getNota() {
        return nota;
    }
    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }
    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Pedido getPedido() {
        return pedido;
    }
    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Produto getProduto() {
        return produto;
    }
    public void setProduto(Produto produto) {
        this.produto = produto;
    }
}