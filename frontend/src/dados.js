const PERFIS = [
  { id: 'CLIENTE', title: 'Cliente' },
  { id: 'VENDEDOR', title: 'Vendedor' },
  { id: 'ADMIN', title: 'Admin' },
];

const ABAS_POR_PERFIL = {
  CLIENTE: [
    { id: 'inicio', label: 'Início', icon: 'home' },
    { id: 'carrinho', label: 'Sacola', icon: 'bag' },
    { id: 'pedidos', label: 'Pedidos', icon: 'orders' },
    { id: 'perfil', label: 'Perfil', icon: 'user' },
  ],
  VENDEDOR: [
    { id: 'painel', label: 'Loja', icon: 'home' },
    { id: 'produtos', label: 'Produtos', icon: 'bag' },
    { id: 'pedidos', label: 'Pedidos', icon: 'orders' },
    { id: 'perfil', label: 'Perfil', icon: 'user' },
  ],
  ADMIN: [
    { id: 'painel', label: 'Painel', icon: 'home' },
    { id: 'categorias', label: 'Categorias', icon: 'bag' },
    { id: 'usuarios', label: 'Usuários', icon: 'user' },
    { id: 'perfil', label: 'Perfil', icon: 'user' },
  ],
};

const ABA_PADRAO = { CLIENTE: 'inicio', VENDEDOR: 'painel', ADMIN: 'painel' };
const PRODUTO_VAZIO = { nome: '', descricao: '', preco: '', foto: '', categoriaId: '', usuarioId: '' };
const CATEGORIA_VAZIA = { nome: '' };
const USUARIO_VAZIO = { nome: '', email: '', senha: '', apartamento: '', tipo: 'CLIENTE' };
const CADASTRO_VAZIO = { nome: '', email: '', senha: '', apartamento: '', tipo: 'CLIENTE' };

export { ABA_PADRAO, ABAS_POR_PERFIL, CADASTRO_VAZIO, CATEGORIA_VAZIA, PERFIS, PRODUTO_VAZIO, USUARIO_VAZIO };