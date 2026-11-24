export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number(valor) || 0);
}

export function formatarData(valor) {
    if (!valor) {
        return '-';
    }
    return new Date(valor).toLocaleString('pt-BR');
}
