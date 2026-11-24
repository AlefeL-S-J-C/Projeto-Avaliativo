import axios from 'axios';

export const baseURL = 'http://localhost:5000';

const api = axios.create({
  baseURL: baseURL,
});

export function urlImagem(caminho) {
  if (!caminho) {
    return null;
  }
  if (/^https?:\/\//i.test(caminho)) {
    return caminho;
  }
  return `${baseURL}${caminho.startsWith('/') ? '' : '/'}${caminho}`;
}

export default api;
