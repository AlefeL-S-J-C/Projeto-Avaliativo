const CheckoutModal = ({
    show,
    cliente,
    formaPagamento,
    finalizando,
    podeFinalizar,
    onClienteChange,
    onFormaPagamentoChange,
    onConfirmar,
    onFechar
}) => {
    if (!show) {
        return null;
    }

    return (
        <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={onConfirmar}>
                            <div className="modal-header">
                                <h2 className="h5 modal-title">Finalizar venda</h2>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={onFechar}
                                    aria-label="Fechar"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="cliente">Nome do cliente</label>
                                    <input
                                        id="cliente"
                                        className="form-control"
                                        type="text"
                                        value={cliente}
                                        onChange={(e) => onClienteChange(e.target.value)}
                                        placeholder="Nome de quem está comprando"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="formaPagamento">Forma de pagamento</label>
                                    <select
                                        id="formaPagamento"
                                        className="form-select"
                                        value={formaPagamento}
                                        onChange={(e) => onFormaPagamentoChange(e.target.value)}
                                        required
                                    >
                                        <option value="Pix">Pix</option>
                                        <option value="Cartão de crédito">Cartão de crédito</option>
                                        <option value="Cartão de débito">Cartão de débito</option>
                                        <option value="Dinheiro">Dinheiro</option>
                                    </select>
                                </div>
                                <p className="text-muted small mb-0">
                                    Ao confirmar, os itens do carrinho serão convertidos em uma venda.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onFechar}
                                    disabled={finalizando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={finalizando || !podeFinalizar}
                                >
                                    {finalizando ? 'Finalizando...' : 'Confirmar venda'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutModal;
