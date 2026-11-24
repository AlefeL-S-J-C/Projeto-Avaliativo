import { useCallback } from 'react';
import api from '../util/api';

const CHAVE_CARRINHO = 'carrinhoId';

function useCarrinho() {
    const buscar = useCallback(async (id) => {
        const response = await api.get(`/carrinho/getById/${id}`);
        return response.data;
    }, []);

    const criar = useCallback(async () => {
        const response = await api.post('/carrinho/create');
        localStorage.setItem(CHAVE_CARRINHO, String(response.data.carrinho.id));
        return response.data.carrinho;
    }, []);

    const obterOuCriar = useCallback(async () => {
        const id = localStorage.getItem(CHAVE_CARRINHO);
        if (id) {
            try {
                return await buscar(id);
            } catch (err) {
                if (!err.response || err.response.status !== 404) {
                    throw err;
                }
                localStorage.removeItem(CHAVE_CARRINHO);
            }
        }
        return criar();
    }, [buscar, criar]);

    const adicionarItem = useCallback(async (carrinhoId, produtoId, quantidade = 1) => {
        const response = await api.post(`/carrinho/${carrinhoId}/itens`, {
            produtoId: produtoId,
            quantidade: quantidade
        });
        return response.data.carrinho;
    }, []);

    const atualizarItem = useCallback(async (carrinhoId, produtoId, quantidade) => {
        const response = await api.put(`/carrinho/${carrinhoId}/itens/${produtoId}`, {
            quantidade: quantidade
        });
        return response.data.carrinho;
    }, []);

    const removerItem = useCallback(async (carrinhoId, produtoId) => {
        const response = await api.delete(`/carrinho/${carrinhoId}/itens/${produtoId}`);
        return response.data.carrinho;
    }, []);

    const reiniciar = useCallback(async () => {
        localStorage.removeItem(CHAVE_CARRINHO);
        return criar();
    }, [criar]);

    return { obterOuCriar, buscar, criar, adicionarItem, atualizarItem, removerItem, reiniciar };
}

export default useCarrinho;
