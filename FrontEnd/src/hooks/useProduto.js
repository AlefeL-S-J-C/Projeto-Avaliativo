import { useCallback } from 'react';
import api from '../util/api';

function useProduto() {
    const getAll = useCallback(async () => {
        const response = await api.get('/produto/getAll');
        return response.data;
    }, []);

    const getById = useCallback(async (id) => {
        const response = await api.get(`/produto/getByID/${id}`);
        return response.data;
    }, []);

    const create = useCallback(async (dados) => {
        const response = await api.post('/produto/create', dados);
        return response.data;
    }, []);

    const update = useCallback(async (id, dados) => {
        const response = await api.put(`/produto/update/${id}`, dados);
        return response.data;
    }, []);

    const remove = useCallback(async (id) => {
        const response = await api.delete(`/produto/delete/${id}`);
        return response.data;
    }, []);

    return { getAll, getById, create, update, remove };
}

export default useProduto;
