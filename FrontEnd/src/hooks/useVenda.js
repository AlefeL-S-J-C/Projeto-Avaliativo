import { useCallback } from 'react';
import api from '../util/api';

function useVenda() {
    const finalizar = useCallback(async (dados) => {
        const response = await api.post('/venda/create', dados);
        return response.data.venda;
    }, []);

    const listar = useCallback(async () => {
        const response = await api.get('/venda/getAll');
        return response.data;
    }, []);

    const buscar = useCallback(async (id) => {
        const response = await api.get(`/venda/getById/${id}`);
        return response.data;
    }, []);

    return { finalizar, listar, buscar };
}

export default useVenda;
