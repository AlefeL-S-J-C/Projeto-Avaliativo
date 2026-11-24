import { formatarMoeda } from '../../util/formatarMoeda';
import { urlImagem } from '../../util/api';

const ProdutoCard = ({ produto, onAdicionar }) => {
    const imagem = urlImagem(produto.imagem);

    return (
        <div className="card h-100 shadow-sm">
            {imagem ? (
                <img
                    src={imagem}
                    className="card-img-top"
                    alt={produto.nome}
                    style={{ height: '140px', objectFit: 'cover' }}
                />
            ) : (
                <div
                    className="bg-light d-flex align-items-center justify-content-center text-muted small"
                    style={{ height: '140px' }}
                >
                    Sem imagem
                </div>
            )}
            <div className="card-body d-flex flex-column">
                <span className="text-uppercase text-muted small mb-1">Produto</span>
                <h3 className="h6 card-title">{produto.nome}</h3>
                <p className="card-text text-primary fw-bold fs-5 mb-3">
                    {formatarMoeda(produto.preco)}
                </p>
                <button className="btn btn-outline-primary mt-auto" onClick={onAdicionar}>
                    Adicionar ao carrinho
                </button>
            </div>
        </div>
    );
};

export default ProdutoCard;
