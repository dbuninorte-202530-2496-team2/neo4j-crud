// src/api/api.js
const API_URL = 'http://localhost:3000/api';

// Utilidad para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
    throw new Error(error.error || 'Error en la petición');
  }
  return response.json();
};

// USUARIOS
export const usuariosAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/usuarios`);
    return handleResponse(response);
  },

  getById: async (idu) => {
    const response = await fetch(`${API_URL}/usuarios/${idu}`);
    return handleResponse(response);
  },

  create: async (nombre) => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    return handleResponse(response);
  },

  update: async (idu, nombre) => {
    const response = await fetch(`${API_URL}/usuarios/${idu}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    return handleResponse(response);
  },

  delete: async (idu) => {
    const response = await fetch(`${API_URL}/usuarios/${idu}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    return true;
  }
};

// POSTS
export const postsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/posts`);
    const posts = await handleResponse(response);
    // El backend devuelve posts con autor incluido
    return posts.map(post => ({
      ...post,
      autor: post.autor || { idu: post.idu, nombre: post.nombre }
    }));
  },

  getFeed: async (limit = 10, offset = 0) => {
    const response = await fetch(`${API_URL}/posts/feed?limit=${limit}&offset=${offset}`);
    return handleResponse(response);
  },

  getById: async (idp) => {
    const response = await fetch(`${API_URL}/posts/${idp}`);
    return handleResponse(response);
  },

  create: async (contenido, idu) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido, idu })
    });
    const newPost = await handleResponse(response);
    // Necesitamos obtener el post completo con autor
    return postsAPI.getById(newPost.idp);
  },

  update: async (idp, contenido) => {
    const response = await fetch(`${API_URL}/posts/${idp}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido })
    });
    const updatedPost = await handleResponse(response);
    // Obtener el post completo con autor
    return postsAPI.getById(updatedPost.idp);
  },

  delete: async (idp) => {
    const response = await fetch(`${API_URL}/posts/${idp}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar post');
    return true;
  }
};

// COMENTARIOS
export const comentariosAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/comentarios`);
    return handleResponse(response);
  },

  getByPost: async (idp) => {
    const response = await fetch(`${API_URL}/comentarios/post/${idp}`);
    return handleResponse(response);
  },

  getById: async (idp, consec) => {
    const response = await fetch(`${API_URL}/comentarios/${idp}/${consec}`);
    return handleResponse(response);
  },

  create: async (idp, idu, contenidoCom, likeNotLike = 'like') => {
    const response = await fetch(`${API_URL}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idp, idu, contenidoCom, likeNotLike })
    });
    return handleResponse(response);
  },

  update: async (idp, consec, contenidoCom, likeNotLike) => {
    const response = await fetch(`${API_URL}/comentarios/${idp}/${consec}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenidoCom, likeNotLike })
    });
    return handleResponse(response);
  },

  authorize: async (idp, consec, iduAutorizador) => {
    const response = await fetch(`${API_URL}/comentarios/${idp}/${consec}/authorize`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ iduAutorizador })
    });
    return handleResponse(response);
  },

  delete: async (idp, consec) => {
    const response = await fetch(`${API_URL}/comentarios/${idp}/${consec}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar comentario');
    return true;
  }
};