import React, { useEffect, useState } from 'react';
import { formatarMoeda, obterItensPedido, obterRotuloPerfil, resumirPedido } from './utils.js';

function LoginScreen({ loginForm, setLoginForm, registerForm, setRegisterForm, authMode, setAuthMode, authMessage, setAuthMessage, login, register }) {
  const isRegister = authMode === 'register';
  function switchMode(mode) {
    setAuthMode(mode);
    setAuthMessage('');
  }

  return (
    <div className="modern-login-shell">
      <main className="modern-login-phone">
        <header className="modern-login-brand">
          <h1><span>Condo</span><strong>Market</strong></h1>
          <p>Seu pedido na sua porta</p>
        </header>

        <section className="modern-login-card">
          <div className="modern-login-welcome">
            <h2>{isRegister ? 'Criar uma conta' : 'Bem-vindo!'}</h2>
            <p>{isRegister ? 'Preencha seus dados para começar' : 'Faça login para continuar'}</p>
          </div>

          {authMessage && <div className={authMessage.startsWith('Cadastro criado') ? 'auth-message success' : 'auth-message'}>{authMessage}</div>}

          {isRegister ? (
            <form className="modern-login-form" onSubmit={register}>
              <label className="modern-input-label">
                <span>Nome</span>
                <div className="modern-input-wrap"><input required value={registerForm.nome} onChange={(event) => setRegisterForm({ ...registerForm, nome: event.target.value })} placeholder="Seu nome" /></div>
              </label>
              <label className="modern-input-label">
                <span>Email</span>
                <div className="modern-input-wrap"><input required type="email" value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} placeholder="seuemail@exemplo.com" /></div>
              </label>
              <label className="modern-input-label">
                <span>Senha</span>
                <div className="modern-input-wrap"><input required type="password" value={registerForm.senha} onChange={(event) => setRegisterForm({ ...registerForm, senha: event.target.value })} placeholder="Crie uma senha" /></div>
              </label>
              <label className="modern-input-label">
                <span>Apartamento</span>
                <div className="modern-input-wrap"><input value={registerForm.apartamento} onChange={(event) => setRegisterForm({ ...registerForm, apartamento: event.target.value })} placeholder="Ex: 1303" /></div>
              </label>

              <div className="modern-register-type" aria-label="Tipo de cadastro">
                <button className={registerForm.tipo === 'CLIENTE' ? 'active' : ''} onClick={() => setRegisterForm({ ...registerForm, tipo: 'CLIENTE' })} type="button">Cliente</button>
                <button className={registerForm.tipo === 'VENDEDOR' ? 'active' : ''} onClick={() => setRegisterForm({ ...registerForm, tipo: 'VENDEDOR' })} type="button">Vendedor</button>
              </div>

              <button className="modern-login-submit" type="submit">Cadastrar</button>
            </form>
          ) : (
            <form className="modern-login-form" onSubmit={login}>
              <label className="modern-input-label">
                <span>Email</span>
                <div className="modern-input-wrap"><input required type="email" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} placeholder="seuemail@exemplo.com" /></div>
              </label>
              <label className="modern-input-label">
                <span>Senha</span>
                <div className="modern-input-wrap"><input required type="password" value={loginForm.senha} onChange={(event) => setLoginForm({ ...loginForm, senha: event.target.value })} placeholder="Digite sua senha" /></div>
              </label>

              <button className="modern-login-submit" type="submit">Entrar</button>
            </form>
          )}

          <div className="modern-login-divider"><span></span><em>ou</em><span></span></div>
          <button className="modern-auth-switch" onClick={() => switchMode(isRegister ? 'login' : 'register')} type="button">
            {isRegister ? 'Já tenho uma conta' : 'Criar uma conta'}
          </button>
        </section>
      </main>
    </div>
  );
}
function ClientArea(props) {
  const { tab, products, allProducts, categories, query, categoryFilter, setQuery, setCategoryFilter, addToCart, loading, openDetails, cart, cartTotal, updateCart, checkoutCart, orders, reviews, saveReview, user, updateProfile, logout } = props;
  if (tab === 'inicio') return <StoreView products={products} allProducts={allProducts} categories={categories} query={query} categoryFilter={categoryFilter} setQuery={setQuery} setCategoryFilter={setCategoryFilter} addToCart={addToCart} loading={loading} openDetails={openDetails} user={user} />;
  if (tab === 'carrinho') return <CartView cart={cart} cartTotal={cartTotal} updateCart={updateCart} checkoutCart={checkoutCart} />;
  if (tab === 'pedidos') return <CustomerOrdersView orders={orders} user={user} products={allProducts} reviews={reviews} saveReview={saveReview} />;
  return <ProfileView user={user} role="CLIENTE" updateProfile={updateProfile} logout={logout} />;
}

function StoreView({ products, allProducts, categories, query, categoryFilter, setQuery, setCategoryFilter, addToCart, loading, openDetails, user }) {
  return (
    <section className="client-home-screen customer-simple-home">
      <header className="selected-address-header">
        <button className="selected-address-button address-selector-button" type="button" aria-label="Trocar condomínio">
          <strong>{'Condom\u00ednio Alpha, 1303'}</strong>
          <span className="address-chevron" aria-hidden="true"></span>
        </button>
      </header>
      <SearchBox query={query} setQuery={setQuery} placeholder="Pesquisar no CondoMarket" />
      <HomeCategoryTiles categories={categories} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
      <SectionHeader title="Produtos" action={`${products.length || allProducts.length} itens`} />
      <ProductList products={products} loading={loading} addToCart={addToCart} openDetails={openDetails} />
    </section>
  );
}

function SearchBox({ query, setQuery, placeholder, autoFocus = false }) {
  return <label className="search-box"><span className="search-icon" aria-hidden="true"></span><input autoFocus={autoFocus} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} /></label>;
}

function HomeCategoryTiles({ categories, categoryFilter, setCategoryFilter }) {
  const categoryTiles = categories.length
    ? [{ id: '', nome: 'Tudo' }, ...categories.map((category) => ({ id: String(category.idCategoria), nome: category.nome }))]
    : [{ id: '', nome: 'Tudo' }, { id: 'mercado', nome: 'Mercado' }, { id: 'bebidas', nome: 'Bebidas' }, { id: 'lanches', nome: 'Lanches' }];

  return (
    <section className="home-category-tiles" aria-label="Categorias">
      {categoryTiles.map((category) => {
        const isActive = String(category.id) === String(categoryFilter || '');
        return <button key={`${category.id}-${category.nome}`} className={isActive ? 'active' : ''} onClick={() => setCategoryFilter(category.id && !Number.isNaN(Number(category.id)) ? String(category.id) : '')} type="button">{category.nome}</button>;
      })}
    </section>
  );
}

function SectionHeader({ title, action }) {
  return <div className="section-header"><h2>{title}</h2><span>{action}</span></div>;
}

function ProductList({ products, loading, addToCart, openDetails }) {
  if (loading) return <div className="empty-state">Carregando produtos...</div>;
  if (products.length === 0) return <div className="empty-state">Nenhum produto encontrado.</div>;
  return <section className="product-list">{products.map((product) => <ProductCard key={product.idProduto} product={product} addToCart={addToCart} openDetails={openDetails} />)}</section>;
}

function ProductCard({ product, addToCart, openDetails }) {
  return (
    <article className="food-card" onClick={() => openDetails(product)}>
      <ProductImage product={product} />
      <div className="food-card-body">
        <h2>{product.nome}</h2>
        <p>{product.descricao || product.categoria?.nome || 'Produto do condomínio'}</p>
        <strong>{formatarMoeda(product.preco)}</strong>
      </div>
      <button className="add-cart-button" onClick={(event) => { event.stopPropagation(); addToCart(product); }} type="button" aria-label={`Adicionar ${product.nome}`}>Adicionar</button>
    </article>
  );
}

function ProductSheet({ product, reviews = [], addToCart, close }) {
  const average = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.nota || 0), 0) / reviews.length : 0;
  return (
    <div className="sheet-backdrop" onClick={close}>
      <section className="product-sheet" onClick={(event) => event.stopPropagation()}>
        <button className="sheet-close" onClick={close} type="button">x</button>
        <ProductImage product={product} />
        <div className="sheet-content">
          <span className="sheet-pill">{product.categoria?.nome || 'Mercado'}</span>
          <h2>{product.nome}</h2>
          <p>{product.descricao || 'Produto disponível no seu condomínio.'}</p>
          <div className="seller-line"><span>{product.usuario?.nome || 'Vendedor CondoMarket'}</span><span>Entrega no bloco</span></div>
          <section className="product-review-section">
            <div className="review-section-title"><h3>Avaliações</h3><span>{reviews.length ? `${average.toFixed(1)} de 5` : 'Sem notas'}</span></div>
            {reviews.length ? (
              <div className="product-review-list">
                {reviews.slice(0, 4).map((review) => <article className="product-review-card" key={review.idAvaliacao}><div className="product-review-author"><strong>{review.usuario?.nome || 'Usuário'}</strong><span>{Number(review.nota || 0)} de 5</span></div><RatingStars value={Number(review.nota || 0)} readOnly /><p>{review.comentario || 'Sem comentário.'}</p></article>)}
              </div>
            ) : <p className="empty-review-copy">Esse produto ainda não tem avaliações.</p>}
          </section>
          <div className="sheet-actions"><button className="primary-button" onClick={() => addToCart(product)} type="button">Adicionar - {formatarMoeda(product.preco)}</button></div>
        </div>
      </section>
    </div>
  );
}

function CartView({ cart, cartTotal, updateCart, checkoutCart }) {
  const [paymentMethod, setPaymentMethod] = useState('pix');
  return (
    <section className="cart-screen customer-checkout-screen">
      <button className="checkout-address-card checkout-address-selector" type="button" aria-label="Endereço de entrega">
        <span className="checkout-address-pin" aria-hidden="true"></span>
        <span className="checkout-address-copy">
          <small>Entregar em</small>
          <strong>{'Condom\u00ednio Alpha, 1303'}</strong>
        </span>
        <span className="checkout-address-chevron" aria-hidden="true"></span>
      </button>
      {cart.length === 0 ? <div className="empty-cart"><div className="empty-cart-icon"></div><h2>Sua cesta está vazia</h2><p>Adicione produtos do mercado do condomínio para montar seu pedido.</p></div> : (
        <>
          <section className="checkout-panel">
            <div className="checkout-panel-header"><h2>Itens da cesta</h2><span>{cart.length} itens</span></div>
            <div className="checkout-list">{cart.map((item) => <article className="checkout-item" key={item.idProduto}><ProductImage product={item} /><div><strong>{item.nome}</strong><span>{formatarMoeda(item.preco)}</span></div><div className="quantity-stepper"><button onClick={() => updateCart(item.idProduto, item.quantity - 1)} type="button">-</button><span>{item.quantity}x</span><button onClick={() => updateCart(item.idProduto, item.quantity + 1)} type="button">+</button></div></article>)}</div>
          </section>
          <section className="payment-method-card">
            <h2>Forma de pagamento</h2>
            <div className="payment-methods" role="group" aria-label="Forma de pagamento">
              <button className={paymentMethod === 'dinheiro' ? 'active' : ''} onClick={() => setPaymentMethod('dinheiro')} type="button">Dinheiro</button>
              <button className={paymentMethod === 'cartao' ? 'active' : ''} onClick={() => setPaymentMethod('cartao')} type="button">Cartão</button>
              <button className={paymentMethod === 'pix' ? 'active' : ''} onClick={() => setPaymentMethod('pix')} type="button">Pix</button>
            </div>
            {paymentMethod === 'pix' && <div className="pix-payment-box"><strong>Pix CondoMarket</strong><span>Chave: condomarket@pix.com</span><small>O vendedor confirma o pedido apos o pagamento.</small></div>}
            {paymentMethod === 'dinheiro' && <div className="payment-note">Pague em dinheiro na entrega.</div>}
            {paymentMethod === 'cartao' && <div className="payment-note">Pague com cartão na entrega.</div>}
          </section>
          <div className="checkout-total-card"><span>Subtotal</span><strong>{formatarMoeda(cartTotal)}</strong><span>Total</span><strong>{formatarMoeda(cartTotal)}</strong></div>
          <div className="checkout-bar"><div><span>Total</span><strong>{formatarMoeda(cartTotal)}</strong></div><button className="primary-button" onClick={checkoutCart} type="button">Finalizar pedido</button></div>
        </>
      )}
    </section>
  );
}

function CustomerOrdersView({ orders, user, products, reviews, saveReview }) {
  const [reviewOrder, setReviewOrder] = useState(null);
  const customerOrders = (user?.id ? orders.filter((order) => String(order.usuario?.id || '') === String(user.id)) : orders).sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  return (
    <div className="screen-stack customer-orders-screen">
      <StatusHero title="Acompanhe seus pedidos" value={customerOrders.length} caption="pedidos feitos" />
      {customerOrders.length === 0 ? <div className="empty-state">Nenhum pedido feito ainda.</div> : (
        <section className="order-list">
          {customerOrders.map((order) => {
            const delivered = String(order.status || '').toUpperCase() === 'ENTREGUE';
            const alreadyReviewed = reviews.some((review) => String(review.pedido?.id || '') === String(order.id));
            return (
              <article className="order-card customer-order-card" key={order.id}>
                <div className="order-topline"><strong>Pedido #{order.id}</strong><span className={`status-pill status-${String(order.status).toLowerCase()}`}>{order.status}</span></div>
                <p>{resumirPedido(order)}</p>
                <div className="price-row"><strong>{formatarMoeda(order.valor)}</strong><span>{delivered ? 'Pedido entregue' : 'Aguardando entrega'}</span></div>
                {delivered && (alreadyReviewed ? <span className="review-done-pill">Avaliado</span> : <button className="secondary-button" onClick={() => setReviewOrder(order)} type="button">Avaliar pedido</button>)}
              </article>
            );
          })}
        </section>
      )}
      {reviewOrder && <ReviewModal order={reviewOrder} products={getOrderProducts(reviewOrder, products)} saveReview={saveReview} close={() => setReviewOrder(null)} />}
    </div>
  );
}

function getOrderProducts(order, products) {
  const itemProducts = obterItensPedido(order).map((item) => item.produto).filter(Boolean);
  if (itemProducts.length) return itemProducts;
  const description = String(order.descricao || '').toLowerCase();
  return products.filter((product) => description.includes(String(product.nome || '').toLowerCase()));
}

function ReviewModal({ order, products, saveReview, close }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const product = products[0];

  useEffect(() => {
    setError('');
  }, [order]);

  async function submitReview(event) {
    event.preventDefault();
    if (!product?.idProduto) {
      setError('Não encontrei produto desse pedido para vincular a avaliação.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await saveReview({ order, productId: product.idProduto, nota: rating, comentario: comment.trim() || 'Pedido avaliado.' });
      close();
    } catch (err) {
      setError(err.message || 'Não foi possível enviar a avaliação.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="review-modal-backdrop" onClick={close}>
      <section className="review-modal" onClick={(event) => event.stopPropagation()}>
        <button className="review-close" onClick={close} type="button">x</button>
        <h2>Avaliar pedido</h2>
        <p>Pedido #{order.id}</p>
        {product ? (
          <form onSubmit={submitReview}>
            <div className="review-question"><strong>O que você achou?</strong><span>Escolha entre 1 e 5</span></div>
            <RatingStars value={rating} onChange={setRating} />
            {error && <div className="review-error">{error}</div>}
            <label>Comentário<textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Como foi a sua experiência?" /></label>
            <button className="primary-button full-button" disabled={saving} type="submit">{saving ? 'Enviando...' : 'Enviar avaliação'}</button>
          </form>
        ) : <div className="empty-state">Não encontrei produtos desse pedido para avaliar.</div>}
      </section>
    </div>
  );
}

function RatingStars({ value, onChange, readOnly = false }) {
  return <div className={readOnly ? 'rating-stars read-only' : 'rating-stars'}>{[1, 2, 3, 4, 5].map((star) => <button key={star} onClick={() => onChange?.(star)} type="button" disabled={readOnly} aria-label={`${star} estrelas`}>{star <= value ? '★' : '☆'}</button>)}</div>;
}

function ProfileView({ user, role, updateProfile, logout }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', apartamento: '' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      nome: user?.nome || '',
      email: user?.email || '',
      senha: '',
      apartamento: user?.apartamento || '',
    });
    setMessage('');
  }, [user]);

  async function submitProfile(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(form);
      setForm((current) => ({ ...current, senha: '' }));
      setMessage('Dados atualizados.');
    } catch (error) {
      setMessage(error.message || 'Não foi possível atualizar seus dados.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profile-edit-screen">
      <section className="profile-edit-card">
        <span>{obterRotuloPerfil(role)} CondoMarket</span>
        <h2>Meus dados</h2>
        {message && <div className={message === 'Dados atualizados.' ? 'profile-message success' : 'profile-message'}>{message}</div>}
        <form className="profile-edit-form" onSubmit={submitProfile}>
          <label>Nome<input required value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} /></label>
          <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>Nova senha<input type="password" value={form.senha} onChange={(event) => setForm({ ...form, senha: event.target.value })} placeholder="Deixe vazio para manter" /></label>
          <label>Apartamento<input value={form.apartamento} onChange={(event) => setForm({ ...form, apartamento: event.target.value })} /></label>
          <button className="primary-button full-button" disabled={saving} type="submit">{saving ? 'Salvando...' : 'Atualizar dados'}</button>
        </form>
      </section>
      <button className="profile-logout-button" onClick={logout} type="button">Sair do app</button>
    </div>
  );
}
function SellerArea(props) {
  const { tab, products, categories, users, orders, form, setForm, saveProduct, editProduct, editingProductId, cancelEdit, remove, updateOrderStatus, user, updateProfile, logout } = props;
  if (tab === 'painel') return <SellerDashboard products={products} orders={orders} user={user} />;
  if (tab === 'produtos') return <ProductsView products={products} categories={categories} users={users} form={form} setForm={setForm} saveProduct={saveProduct} editProduct={editProduct} editingProductId={editingProductId} cancelEdit={cancelEdit} remove={remove} sellerMode />;
  if (tab === 'pedidos') return <SellerOrdersView orders={orders} updateOrderStatus={updateOrderStatus} />;
  return <ProfileView user={user} role="VENDEDOR" updateProfile={updateProfile} logout={logout} />;
}

function AdminArea(props) {
  const { tab, products, categories, users, categoryForm, setCategoryForm, saveCategory, userForm, setUserForm, saveUser, remove, user, updateProfile, logout } = props;
  if (tab === 'painel') return <AdminDashboard products={products} categories={categories} users={users} />;
  if (tab === 'categorias') return <CategoriesView categories={categories} form={categoryForm} setForm={setCategoryForm} saveCategory={saveCategory} remove={remove} />;
  if (tab === 'usuarios') return <UsersView users={users} form={userForm} setForm={setUserForm} saveUser={saveUser} remove={remove} />;
  return <ProfileView user={user} role="ADMIN" updateProfile={updateProfile} logout={logout} />;
}
function SellerDashboard({ products, orders }) {
  const pending = orders.filter((order) => order.status === 'PENDENTE').length;
  const revenue = orders.reduce((sum, order) => sum + Number(order.valor || 0), 0);
  return <div className="screen-stack"><div className="metrics-grid"><MetricCard label="Produtos" value={products.length} /><MetricCard label="Pendentes" value={pending} /><MetricCard label="Faturamento" value={formatarMoeda(revenue)} wide /></div><SectionHeader title="Pedidos recentes" action={`${orders.length} pedidos`} /><SellerOrdersView orders={orders.slice(0, 3)} compact /></div>;
}

function SellerOrdersView({ orders, updateOrderStatus, compact = false }) {
  if (!orders.length) return <div className="empty-state">Nenhum pedido recebido ainda.</div>;
  return (
    <section className="order-list">
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <div className="order-topline"><strong>Pedido #{order.id}</strong><span className={`status-pill status-${String(order.status).toLowerCase()}`}>{order.status}</span></div>
          <p>{resumirPedido(order)}</p>
          <div className="price-row"><strong>{formatarMoeda(order.valor)}</strong><span>{order.usuario?.nome || 'Cliente'}</span></div>
          {!compact && updateOrderStatus && <div className="order-actions"><button className="secondary-button" onClick={() => updateOrderStatus(order, 'PROCESSANDO')} type="button">Aceitar</button><button className="secondary-button" onClick={() => updateOrderStatus(order, 'ENVIADO')} type="button">Enviar</button><button className="primary-button" onClick={() => updateOrderStatus(order, 'ENTREGUE')} type="button">Entregar</button></div>}
        </article>
      ))}
    </section>
  );
}

function AdminDashboard({ products, categories, users }) {
  return <div className="screen-stack"><section className="admin-hero"><span>Administração</span><h2>Controle do CondoMarket</h2><p>Cadastre categorias e revise usuários.</p></section><div className="metrics-grid"><MetricCard label="Produtos" value={products.length} /><MetricCard label="Categorias" value={categories.length} /><MetricCard label="Usuários" value={users.length} /></div></div>;
}

function MetricCard({ label, value, wide = false }) {
  return <article className={wide ? 'metric-card wide' : 'metric-card'}><span>{label}</span><strong>{value}</strong></article>;
}

function StatusHero({ title, value, caption }) {
  return <section className="status-hero"><div><span>{caption}</span><h2>{title}</h2></div><strong>{value}</strong></section>;
}

function fileToProductImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('invalid-file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSide = 900;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      image.onerror = () => reject(new Error('invalid-image'));
      image.src = reader.result;
    };
    reader.onerror = () => reject(new Error('read-error'));
    reader.readAsDataURL(file);
  });
}
function ProductsView({ products, categories, users, form, setForm, saveProduct, editProduct, editingProductId, cancelEdit, remove, sellerMode = false }) {
  const sellerUsers = users.filter((user) => user.tipo === 'VENDEDOR');
  const userOptions = sellerMode ? sellerUsers : users;
  async function handleProductImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imageData = await fileToProductImage(file);
      setForm((current) => ({ ...current, foto: imageData }));
    } catch {
      window.alert('Não foi possível carregar a imagem. Escolha JPG, PNG ou WEBP.');
    } finally {
      event.target.value = '';
    }
  }
  return (
    <div className="screen-stack">
      <form className="panel" onSubmit={saveProduct}>
        <h2>{editingProductId ? 'Editar produto' : 'Novo produto'}</h2>
        <label>Nome<input required value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} /></label>
        <label>Preço<input required min="0" step="0.01" type="number" value={form.preco} onChange={(event) => setForm({ ...form, preco: event.target.value })} /></label>
        <label>Categoria<select value={form.categoriaId} onChange={(event) => setForm({ ...form, categoriaId: event.target.value })}><option value="">Sem categoria</option>{categories.map((category) => <option key={category.idCategoria} value={category.idCategoria}>{category.nome}</option>)}</select></label>
        {!sellerMode && <label>Vendedor<select value={form.usuarioId} onChange={(event) => setForm({ ...form, usuarioId: event.target.value })}><option value="">Sem vendedor</option>{userOptions.map((user) => <option key={user.id} value={user.id}>{user.nome} ({user.tipo})</option>)}</select></label>}
        <label>Descrição<textarea value={form.descricao} onChange={(event) => setForm({ ...form, descricao: event.target.value })} /></label>
        <div className="photo-upload-field">
          <span>Foto do produto</span>
          <label className={form.foto ? 'photo-upload-box has-photo' : 'photo-upload-box'}>
            {form.foto ? <img src={form.foto} alt="Preview do produto" /> : <span className="photo-upload-empty"><strong>Escolher foto</strong><small>Enviar do dispositivo</small></span>}
            <input type="file" accept="image/*" onChange={handleProductImageUpload} />
          </label>
          {form.foto && <button className="secondary-button" type="button" onClick={() => setForm((current) => ({ ...current, foto: '' }))}>Remover foto</button>}
          <label className="photo-url-fallback">Ou cole uma URL<input value={form.foto && !form.foto.startsWith('data:') ? form.foto : ''} onChange={(event) => setForm({ ...form, foto: event.target.value })} /></label>
        </div>
        <div className="form-actions"><button className="primary-button" type="submit">{editingProductId ? 'Salvar' : 'Cadastrar'}</button>{editingProductId && <button className="secondary-button" type="button" onClick={cancelEdit}>Cancelar</button>}</div>
      </form>
      <DataTable columns={['Produto', 'Categoria', 'Preço', 'Vendedor']} rows={products.map((product) => ({ id: product.idProduto, cells: [product.nome, product.categoria?.nome || '-', formatarMoeda(product.preco), product.usuario?.nome || '-'], onEdit: () => editProduct(product), onRemove: () => remove('produtos', product.idProduto) }))} />
    </div>
  );
}

function CategoriesView({ categories, form, setForm, saveCategory, remove }) {
  return <div className="screen-stack"><form className="panel" onSubmit={saveCategory}><h2>Nova categoria</h2><label>Nome<input required value={form.nome} onChange={(event) => setForm({ nome: event.target.value })} /></label><button className="primary-button full-button" type="submit">Cadastrar</button></form><DataTable columns={['ID', 'Nome']} rows={categories.map((category) => ({ id: category.idCategoria, cells: [category.idCategoria, category.nome], onRemove: () => remove('categorias', category.idCategoria) }))} /></div>;
}

function UsersView({ users, form, setForm, saveUser, remove }) {
  return (
    <div className="screen-stack">
      <form className="panel" onSubmit={saveUser}>
        <h2>Novo usuário</h2>
        <label>Nome<input required value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} /></label>
        <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label>Senha<input required type="password" value={form.senha} onChange={(event) => setForm({ ...form, senha: event.target.value })} /></label>
        <label>Apartamento<input value={form.apartamento} onChange={(event) => setForm({ ...form, apartamento: event.target.value })} /></label>
        <label>Tipo<select value={form.tipo} onChange={(event) => setForm({ ...form, tipo: event.target.value })}><option value="CLIENTE">Cliente</option><option value="VENDEDOR">Vendedor</option></select></label>
        <button className="primary-button full-button" type="submit">Cadastrar</button>
      </form>
      <DataTable columns={['Nome', 'Email', 'Apto', 'Tipo']} rows={users.map((user) => ({ id: user.id, cells: [user.nome, user.email, user.apartamento || '-', user.tipo], onRemove: () => remove('usuarios', user.id) }))} />
    </div>
  );
}

function ProductImage({ product }) {
  const hasImageUrl = product.foto && (product.foto.startsWith('http://') || product.foto.startsWith('https://') || product.foto.startsWith('/') || product.foto.startsWith('data:'));
  if (hasImageUrl) return <img className="product-image" src={product.foto} alt={product.nome} />;
  return <div className="product-image fallback-image"><span>{product.nome?.slice(0, 2).toUpperCase() || 'CM'}</span></div>;
}

function DataTable({ columns, rows }) {
  if (rows.length === 0) return <div className="empty-state">Nenhum registro encontrado.</div>;
  return (
    <section className="record-list">
      {rows.map((row) => (
        <article className="record-card" key={row.id}>
          <div className="record-grid">{row.cells.map((cell, index) => <div key={`${row.id}-${index}`}><span>{columns[index]}</span><strong>{cell}</strong></div>)}</div>
          <div className="record-actions">{row.onEdit && <button className="secondary-button" onClick={row.onEdit} type="button">Editar</button>}{row.onRemove && <button className="danger-button" onClick={row.onRemove} type="button">Remover</button>}</div>
        </article>
      ))}
    </section>
  );
}

function BottomNav({ activeTab, setTab, tabs, cartCount }) {
  return (
    <nav className="bottom-nav" aria-label="Navegacao inferior" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
      {tabs.map((item) => (
        <button key={item.id} className={activeTab === item.id ? 'active' : ''} onClick={() => setTab(item.id)} type="button">
          <span className={`nav-icon ${item.icon}`} aria-hidden="true"></span>
          {item.label}
          {item.id === 'carrinho' && cartCount > 0 && <b>{cartCount}</b>}
        </button>
      ))}
    </nav>
  );
}

export { AdminArea, BottomNav, ClientArea, LoginScreen, ProductSheet, SellerArea };
