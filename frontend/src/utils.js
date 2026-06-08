import { PERFIS } from './dados.js';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterIdProduto(produto) {
  return produto.idProduto;
}

function calcularTotalItem(item) {
  return Number(item.preco || 0) * Number(item.quantity || 1);
}

function obterItensPedido(pedido) {
  return Array.isArray(pedido?.itens) ? pedido.itens : [];
}

function resumirPedido(pedido) {
  const itens = obterItensPedido(pedido);
  if (itens.length) {
    return itens.map((item) => `${item.quantidade || 1}x ${item.produto?.nome || 'Produto'}`).join(', ');
  }
  return pedido?.descricao || 'Pedido sem itens';
}

function obterRotuloPerfil(perfil) {
  return PERFIS.find((item) => item.id === perfil)?.title || 'Usuário';
}

export { calcularTotalItem, formatarMoeda, obterIdProduto, obterItensPedido, obterRotuloPerfil, resumirPedido };