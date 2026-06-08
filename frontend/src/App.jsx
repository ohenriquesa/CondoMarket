import React, { useEffect, useMemo, useState } from 'react';
import { API_URL, api } from './api.js';
import { AdminArea, BottomNav, ClientArea, LoginScreen, ProductSheet, SellerArea } from './componentes.jsx';
import { ABA_PADRAO, ABAS_POR_PERFIL, CADASTRO_VAZIO, CATEGORIA_VAZIA, PRODUTO_VAZIO, USUARIO_VAZIO } from './dados.js';
import { calcularTotalItem, obterIdProduto, obterItensPedido, resumirPedido } from './utils.js';

export default function App() {
  const [session, setSession] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', senha: '' });
  const [registerForm, setRegisterForm] = useState(CADASTRO_VAZIO);
  const [authMode, setAuthMode] = useState('login');
  const [authMessage, setAuthMessage] = useState('');
  const [tab, setTab] = useState('inicio');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState(PRODUTO_VAZIO);
  const [categoryForm, setCategoryForm] = useState(CATEGORIA_VAZIA);
  const [userForm, setUserForm] = useState(USUARIO_VAZIO);
  const [editingProductId, setEditingProductId] = useState(null);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + calcularTotalItem(item), 0), [cart]);
  const currentSellerId = session?.role === 'VENDEDOR' ? (session.user?.id || '') : '';
  const vendorProducts = useMemo(() => {
    if (session?.role !== 'VENDEDOR' || !currentSellerId) return [];
    return products.filter((product) => String(product.usuario?.id || '') === String(currentSellerId));
  }, [products, session, currentSellerId]);
  const vendorOrders = useMemo(() => {
    if (session?.role !== 'VENDEDOR' || !vendorProducts.length) return [];
    const productIds = vendorProducts.map((product) => String(product.idProduto || '')).filter(Boolean);
    const names = vendorProducts.map((product) => product.nome?.toLowerCase()).filter(Boolean);
    return orders.filter((order) => {
      const itemProductIds = obterItensPedido(order).map((item) => String(item.produto?.idProduto || '')).filter(Boolean);
      if (itemProductIds.some((id) => productIds.includes(id))) return true;
      return names.some((name) => order.descricao?.toLowerCase().includes(name));
    });
  }, [orders, session, vendorProducts]);
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = query.toLowerCase().trim();
      const matchesQuery = !search || product.nome?.toLowerCase().includes(search) || product.descricao?.toLowerCase().includes(search) || product.categoria?.nome?.toLowerCase().includes(search) || product.usuario?.nome?.toLowerCase().includes(search);
      const matchesCategory = !categoryFilter || String(product.categoria?.idCategoria) === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, categoryFilter]);

  useEffect(() => { if (session) refreshAll(); }, [session]);
  useEffect(() => { setNotice(''); }, [tab]);
  useEffect(() => {
    if (!session) return;
    const tabs = ABAS_POR_PERFIL[session.role] || [];
    if (!tabs.some((item) => item.id === tab)) setTab(ABA_PADRAO[session.role]);
  }, [session, tab]);
  useEffect(() => {
    if (session?.role === 'VENDEDOR' && currentSellerId && !productForm.usuarioId) {
      setProductForm((current) => ({ ...current, usuarioId: currentSellerId }));
    }
  }, [session, currentSellerId, productForm.usuarioId]);

  async function login(event) {
    event.preventDefault();
    setAuthMessage('');

    const email = loginForm.email.trim();
    const senha = loginForm.senha;
    if (!email || !senha) {
      setAuthMessage('Informe email e senha para entrar.');
      return;
    }

    try {
      const user = await api.login({ email, senha });
      const role = user.tipo || 'CLIENTE';
      setSession({ role, user });
      setTab(ABA_PADRAO[role]);
      setNotice('');
      setAuthMessage('');
    } catch (error) {
      setAuthMessage(error.message || 'Email ou senha inválidos.');
    }
  }

  async function register(event) {
    event.preventDefault();
    setAuthMessage('');

    const payload = {
      nome: registerForm.nome.trim(),
      email: registerForm.email.trim(),
      senha: registerForm.senha,
      apartamento: registerForm.apartamento.trim(),
      tipo: registerForm.tipo === 'VENDEDOR' ? 'VENDEDOR' : 'CLIENTE',
    };

    if (!payload.nome || !payload.email || !payload.senha) {
      setAuthMessage('Preencha nome, email e senha para cadastrar.');
      return;
    }

    try {
      await api.register(payload);
      setLoginForm({ email: payload.email, senha: '' });
      setRegisterForm(CADASTRO_VAZIO);
      setAuthMode('login');
      setAuthMessage('Cadastro criado. Entre com email e senha.');
    } catch (error) {
      setAuthMessage(error.message || 'Não foi possível criar o cadastro.');
    }
  }
  function logout() {
    setSession(null);
    setTab('inicio');
    setCart([]);
    setNotice('');
    setSelectedProduct(null);
  }

  async function refreshAll() {
    setLoading(true);
    try {
      const [productData, categoryData, userData, orderData, reviewData] = await Promise.all([
        api.list('produtos'),
        api.list('categorias'),
        api.list('usuarios'),
        api.list('pedidos'),
        api.list('avaliacoes'),
      ]);
      setProducts(productData);
      setCategories(categoryData);
      setUsers(userData);
      setOrders([...orderData].sort((a, b) => Number(b.id || 0) - Number(a.id || 0)));
      setReviews(reviewData);
      setNotice('');
    } catch {
      setNotice(`Não foi possível conectar na API em ${API_URL}. Verifique se o Spring Boot está rodando e clique em atualizar.`);
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct(event) {
    event.preventDefault();
    const sellerId = session?.role === 'VENDEDOR' ? currentSellerId : productForm.usuarioId;
    if (session?.role === 'VENDEDOR' && !sellerId) {
      setNotice('Não foi possível identificar o vendedor logado.');
      return;
    }
    const payload = {
      nome: productForm.nome.trim(),
      descricao: productForm.descricao.trim(),
      preco: Number(productForm.preco),
      foto: productForm.foto.trim() || null,
      categoria: productForm.categoriaId ? { idCategoria: Number(productForm.categoriaId) } : null,
      usuario: sellerId ? { id: Number(sellerId) } : null,
    };
    try {
      editingProductId ? await api.update('produtos', editingProductId, payload) : await api.create('produtos', payload);
      setProductForm({ ...PRODUTO_VAZIO, usuarioId: session?.role === 'VENDEDOR' ? currentSellerId : '' });
      setEditingProductId(null);
      await refreshAll();
      setNotice('Produto salvo com sucesso.');
    } catch {
      setNotice('Não foi possível salvar o produto. Confira categoria e preço.');
    }
  }

  async function saveCategory(event) {
    event.preventDefault();
    try {
      await api.create('categorias', { nome: categoryForm.nome.trim() });
      setCategoryForm(CATEGORIA_VAZIA);
      await refreshAll();
      setNotice('Categoria cadastrada.');
    } catch { setNotice('Não foi possível cadastrar a categoria.'); }
  }

  async function saveUser(event) {
    event.preventDefault();
    try {
      await api.create('usuarios', { ...userForm, tipo: userForm.tipo === 'VENDEDOR' ? 'VENDEDOR' : 'CLIENTE' });
      setUserForm(USUARIO_VAZIO);
      await refreshAll();
      setNotice('Usuário cadastrado.');
    } catch { setNotice('Não foi possível cadastrar o usuário.'); }
  }
  async function checkoutCart() {
    if (!cart.length) return;
    try {
      await api.create('pedidos', {
        descricao: resumirPedido({ itens: cart.map((item) => ({ quantidade: item.quantity, produto: item })) }),
        valor: cartTotal,
        status: 'PENDENTE',
        usuario: session?.user?.id ? { id: Number(session.user.id) } : null,
        itens: cart.map((item) => ({
          quantidade: Number(item.quantity || 1),
          produto: { idProduto: Number(item.idProduto) },
        })),
      });
      setCart([]);
      await refreshAll();
      setNotice('');
      setTab('pedidos');
    } catch { setNotice('Não foi possível finalizar o pedido.'); }
  }

  async function updateOrderStatus(order, status) {
    try {
      await api.update('pedidos', order.id, {
        descricao: order.descricao,
        valor: Number(order.valor),
        status,
        usuario: order.usuario?.id ? { id: Number(order.usuario.id) } : null,
      });
      await refreshAll();
      setNotice(`Pedido atualizado para ${status}.`);
    } catch { setNotice('Não foi possível atualizar o pedido.'); }
  }

  async function saveReview({ order, productId, nota, comentario }) {
    if (!session?.user?.id) throw new Error('Entre novamente para avaliar.');
    await api.create('avaliacoes', {
      nota: Number(nota),
      comentario: comentario.trim(),
      pedido: { id: Number(order.id) },
      usuario: { id: Number(session.user.id) },
      produto: { idProduto: Number(productId) },
    });
    await refreshAll();
    setNotice('Avaliacao enviada.');
  }
  async function remove(resource, id) {
    if (!window.confirm('Deseja remover este registro?')) return;
    try {
      if (resource === 'categorias') {
        const linkedProducts = await api.productsByCategory(id);
        await Promise.all(linkedProducts.map((product) => api.update('produtos', product.idProduto, { ...product, categoria: null })));
      }
      await api.remove(resource, id);
      await refreshAll();
      setNotice('Registro removido.');
    } catch { setNotice('Não foi possível remover. Ele pode estar vinculado a outro cadastro.'); }
  }

  async function updateProfile(form) {
    if (!session?.user?.id) {
      throw new Error('Usuário sem ID para atualizar. Entre novamente.');
    }

    const payload = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      senha: form.senha,
      apartamento: form.apartamento.trim(),
      tipo: session.role,
    };

    const updatedUser = await api.update('usuarios', session.user.id, payload);
    setSession((current) => ({ ...current, user: updatedUser, role: updatedUser.tipo || current.role }));
    await refreshAll();
    return updatedUser;
  }
  function editProduct(product) {
    setTab('produtos');
    setEditingProductId(obterIdProduto(product));
    setProductForm({
      nome: product.nome || '',
      descricao: product.descricao || '',
      preco: product.preco ?? '',
      foto: product.foto || '',
      categoriaId: product.categoria?.idCategoria || '',
      usuarioId: product.usuario?.id || '',
    });
  }

  function addToCart(product) {
    setCart((current) => {
      const productId = obterIdProduto(product);
      const existing = current.find((item) => item.idProduto === productId);
      if (existing) {
        return current.map((item) => item.idProduto === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function addToCartFromDetails(product) {
    addToCart(product);
    setSelectedProduct(null);
    setTab('carrinho');
  }
  function updateCart(productId, quantity) {
    if (quantity <= 0) return setCart((current) => current.filter((item) => item.idProduto !== productId));
    setCart((current) => current.map((item) => item.idProduto === productId ? { ...item, quantity } : item));
  }

  if (!session) {
    return <LoginScreen loginForm={loginForm} setLoginForm={setLoginForm} registerForm={registerForm} setRegisterForm={setRegisterForm} authMode={authMode} setAuthMode={setAuthMode} authMessage={authMessage} setAuthMessage={setAuthMessage} login={login} register={register} />;
  }

  const tabs = ABAS_POR_PERFIL[session.role];

  return (
    <div className={`app app-${session.role.toLowerCase()}`}>
      <main className="mobile-app">
        {notice && <div className="notice">{notice}</div>}

        {session.role === 'CLIENTE' && (
          <ClientArea
            tab={tab}
            products={filteredProducts}
            allProducts={products}
            categories={categories}
            query={query}
            categoryFilter={categoryFilter}
            setQuery={setQuery}
            setCategoryFilter={setCategoryFilter}
            addToCart={addToCart}
            loading={loading}
            openDetails={setSelectedProduct}
            cart={cart}
            cartTotal={cartTotal}
            updateCart={updateCart}
            checkoutCart={checkoutCart}
            orders={orders}
            reviews={reviews}
            saveReview={saveReview}
            user={session.user}
            updateProfile={updateProfile}
            logout={logout}
          />
        )}

        {session.role === 'VENDEDOR' && (
          <SellerArea
            tab={tab}
            products={vendorProducts}
            categories={categories}
            users={users}
            orders={vendorOrders}
            form={productForm}
            setForm={setProductForm}
            saveProduct={saveProduct}
            editProduct={editProduct}
            editingProductId={editingProductId}
            cancelEdit={() => { setEditingProductId(null); setProductForm({ ...PRODUTO_VAZIO, usuarioId: currentSellerId }); }}
            remove={remove}
            updateOrderStatus={updateOrderStatus}
            user={session.user}
            updateProfile={updateProfile}
            logout={logout}
          />
        )}

        {session.role === 'ADMIN' && (
          <AdminArea
            tab={tab}
            products={products}
            categories={categories}
            users={users}
            productForm={productForm}
            setProductForm={setProductForm}
            saveProduct={saveProduct}
            editProduct={editProduct}
            editingProductId={editingProductId}
            cancelEdit={() => { setEditingProductId(null); setProductForm(PRODUTO_VAZIO); }}
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            saveCategory={saveCategory}
            userForm={userForm}
            setUserForm={setUserForm}
            saveUser={saveUser}
            remove={remove}
            user={session.user}
            updateProfile={updateProfile}
            logout={logout}
          />
        )}
      </main>
      <BottomNav activeTab={tab} setTab={setTab} tabs={tabs} cartCount={cartCount} />
      {selectedProduct && <ProductSheet product={selectedProduct} reviews={reviews.filter((review) => String(review.produto?.idProduto || '') === String(selectedProduct.idProduto))} addToCart={addToCartFromDetails} close={() => setSelectedProduct(null)} />}
    </div>
  );
}