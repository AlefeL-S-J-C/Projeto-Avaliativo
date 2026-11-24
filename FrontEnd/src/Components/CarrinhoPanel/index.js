import { formatarMoeda } from '../../util/formatarMoeda';
import { urlImagem } from '../../util/api';

const CarrinhoPanel = ({ carrinho, onAlterarQuantidade, onRemover, onFinalizar }) => {
    const itens = (carrinho && carrinho.itens) || [];
    const quantidadeItens = itens.reduce((total, item) => total + item.quantidade, 0);

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <span>Seu carrinho</span>
                <span className="badge bg-light text-dark">{quantidadeItens} item(ns)</span>
            </div>
            <div className="card-body">
                {itens.length === 0 ? (
                    <div className="alert alert-light border text-center mb-0" role="status">
                        Nenhum produto no carrinho.
                    </div>
                ) : (
                    <ul className="list-group list-group-flush">
                        {itens.map((item) => (
                            <li className="list-group-item px-0" key={item.produtoId}>
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                    <div className="d-flex align-items-center gap-2">
                                        {item.imagem && (
                                            <img
                                                src={urlImagem(item.imagem)}
                                                alt={item.nome}
                                                className="rounded"
                                                style={{ width: 36, height: 36, objectFit: 'cover' }}
                                            />
                                        )}
                                        <div>
                                            <strong>{item.nome}</strong>
                                            <div className="text-muted small">
                                                {formatarMoeda(item.precoUnitario)} cada
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => onRemover(item.produtoId)}
                                        aria-label={`Remover ${item.nome}`}
                                    >
                                        Remover
                                    </button>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <div className="btn-group btn-group-sm" role="group" aria-label="Quantidade">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => onAlterarQuantidade(item, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="btn btn-light disabled">{item.quantidade}</span>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => onAlterarQuantidade(item, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <strong>{formatarMoeda(item.subtotal)}</strong>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="d-flex justify-content-between mt-3">
                    <span className="text-muted">Total</span>
                    <strong className="text-primary fs-5">{formatarMoeda(carrinho && carrinho.total)}</strong>
                </div>

                <button
                    type="button"
                    className="btn btn-success w-100 mt-3"
                    disabled={itens.length === 0}
                    onClick={onFinalizar}
                >
                    Finalizar venda
                </button>
            </div>
        </div>
    );
};

export default CarrinhoPanel;
