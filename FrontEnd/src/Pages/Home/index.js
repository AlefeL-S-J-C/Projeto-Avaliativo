import { useCallback, useEffect, useState } from 'react';
import useProduto from '../../hooks/useProduto';
import useCarrinho from '../../hooks/useCarrinho';
import useVenda from '../../hooks/useVenda';
import ProdutoCard from '../../Components/ProdutoCard';
import CarrinhoPanel from '../../Components/CarrinhoPanel';
import CheckoutModal from '../../Components/CheckoutModal';
import { formatarData, formatarMoeda } from '../../util/formatarMoeda';

const Home = () => {
    const { getAll: listarProdutos } = useProduto();
    const { obterOuCriar, adicionarItem, atualizarItem, removerItem, reiniciar } = useCarrinho();
    const { finalizar, listar: listarVendas } = useVenda();

    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState(null);
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [vendaFinalizada, setVendaFinalizada] = useState(null);
    const [abrirCheckout, setAbrirCheckout] = useState(false);
    const [cliente, setCliente] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('Pix');
    const [finalizando, setFinalizando] = useState(false);

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setErro('');
        try {
            const [produtosApi, carrinhoApi, vendasApi] = await Promise.all([
                listarProdutos(),
                obterOuCriar(),
                listarVendas()
            ]);
            setProdutos(produtosApi);
            setCarrinho(carrinhoApi);
            setVendas(vendasApi);
        } catch (err) {
            setErro(err.response?.data?.message || 'Não foi possível carregar os dados. Verifique se a API está em execução.');
        } finally {
            setCarregando(false);
        }
    }, [listarProdutos, obterOuCriar, listarVendas]);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    function tratarErro(err) {
        setErro(err.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
    }

    async function adicionarAoCarrinho(produto) {
        if (!carrinho) {
            return;
        }
        setErro('');
        setSucesso('');
        try {
            setCarrinho(await adicionarItem(carrinho.id, produto.id, 1));
            setSucesso(`${produto.nome} adicionado ao carrinho.`);
        } catch (err) {
            tratarErro(err);
        }
    }

    async function alterarQuantidade(item, delta) {
        if (!carrinho) {
            return;
        }
        const quantidade = item.quantidade + delta;
        setErro('');
        try {
            const carrinhoAtualizado = quantidade <= 0
                ? await removerItem(carrinho.id, item.produtoId)
                : await atualizarItem(carrinho.id, item.produtoId, quantidade);
            setCarrinho(carrinhoAtualizado);
        } catch (err) {
            tratarErro(err);
        }
    }

    async function removerDoCarrinho(produtoId) {
        if (!carrinho) {
            return;
        }
        setErro('');
        try {
            setCarrinho(await removerItem(carrinho.id, produtoId));
        } catch (err) {
            tratarErro(err);
        }
    }

    async function confirmarVenda(e) {
        e.preventDefault();
        if (!cliente.trim()) {
            setErro('Informe o nome do cliente para finalizar a venda.');
            return;
        }
        if (!carrinho || carrinho.itens.length === 0) {
            setErro('Adicione produtos ao carrinho antes de finalizar a venda.');
            return;
        }

        setErro('');
        setFinalizando(true);
        try {
            const venda = await finalizar({
                carrinhoId: carrinho.id,
                cliente: cliente.trim(),
                formaPagamento: formaPagamento
            });
            setVendaFinalizada(venda);
            setVendas(await listarVendas());
            setCarrinho(await reiniciar());
            setAbrirCheckout(false);
            setCliente('');
            setFormaPagamento('Pix');
            setSucesso(`Venda nº ${venda.id} finalizada com sucesso!`);
        } catch (err) {
            tratarErro(err);
        } finally {
            setFinalizando(false);
        }
    }

    const quantidadeItens = (carrinho?.itens || []).reduce((total, item) => total + item.quantidade, 0);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Painel de Vendas</h1>
                    <p className="text-muted mb-0">Produtos, carrinho e finalização de vendas</p>
                </div>
                <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={carregarDados}
                    disabled={carregando}
                >
                    Atualizar
                </button>
            </div>

            {erro && (
                <div className="alert alert-danger" role="alert">{erro}</div>
            )}
            {sucesso && (
                <div className="alert alert-success" role="alert">{sucesso}</div>
            )}
            {vendaFinalizada && (
                <div className="alert alert-info alert-dismissible" role="status">
                    Venda nº {vendaFinalizada.id} finalizada para {vendaFinalizada.cliente} no valor de {formatarMoeda(vendaFinalizada.total)}.
                    <button type="button" className="btn-close" onClick={() => setVendaFinalizada(null)} aria-label="Fechar"></button>
                </div>
            )}

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <span className="text-muted small">Produtos disponíveis</span>
                            <div className="fs-4 fw-bold">{produtos.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <span className="text-muted small">Itens no carrinho</span>
                            <div className="fs-4 fw-bold">{quantidadeItens}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <span className="text-muted small">Total do carrinho</span>
                            <div className="fs-4 fw-bold text-primary">{formatarMoeda(carrinho?.total)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {carregando ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="text-muted mt-2">Carregando dados...</p>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="h5 mb-0">Produtos</h2>
                            <span className="badge bg-primary">{produtos.length} disponível(is)</span>
                        </div>

                        {produtos.length === 0 ? (
                            <div className="alert alert-warning" role="status">
                                Nenhum produto cadastrado. Cadastre produtos na página <strong>Produtos</strong>.
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                                {produtos.map((produto) => (
                                    <div className="col" key={produto.id}>
                                        <ProdutoCard
                                            produto={produto}
                                            onAdicionar={() => adicionarAoCarrinho(produto)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <h2 className="h5 mt-4 mb-3">Últimas vendas</h2>
                        <div className="table-responsive">
                            <table className="table table-striped table-sm align-middle">
                                <thead>
                                    <tr>
                                        <th>Nº</th>
                                        <th>Cliente</th>
                                        <th>Data</th>
                                        <th>Pagamento</th>
                                        <th className="text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendas.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center text-muted">Nenhuma venda realizada</td>
                                        </tr>
                                    ) : (
                                        vendas.slice(0, 5).map((venda) => (
                                            <tr key={venda.id}>
                                                <td>#{venda.id}</td>
                                                <td>{venda.cliente}</td>
                                                <td>{formatarData(venda.data)}</td>
                                                <td>{venda.formaPagamento}</td>
                                                <td className="text-end">{formatarMoeda(venda.total)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <CarrinhoPanel
                            carrinho={carrinho}
                            onAlterarQuantidade={alterarQuantidade}
                            onRemover={removerDoCarrinho}
                            onFinalizar={() => setAbrirCheckout(true)}
                        />
                    </div>
                </div>
            )}

            <CheckoutModal
                show={abrirCheckout}
                cliente={cliente}
                formaPagamento={formaPagamento}
                finalizando={finalizando}
                podeFinalizar={quantidadeItens > 0}
                onClienteChange={setCliente}
                onFormaPagamentoChange={setFormaPagamento}
                onConfirmar={confirmarVenda}
                onFechar={() => setAbrirCheckout(false)}
            />
        </div>
    );
};

export default Home;
