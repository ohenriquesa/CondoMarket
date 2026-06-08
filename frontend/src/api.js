const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Erro ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  login: (data) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  register: (data) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  list: (resource) => request(`/${resource}`),
  productsByCategory: (categoryId) => request(`/produtos/categoria/${categoryId}`),
  create: (resource, data) => request(`/${resource}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (resource, id, data) => request(`/${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  remove: (resource, id) => request(`/${resource}/${id}`, {
    method: 'DELETE',
  }),
};

export { API_URL };
