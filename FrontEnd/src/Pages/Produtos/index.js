import { useEffect, useState } from "react";
import InputGroup from "../../Components/inputGroup";
import useProduto from "../../hooks/useProduto";
import { formatarMoeda } from "../../util/formatarMoeda";
import { urlImagem } from "../../util/api";

const produtoVazio = { nome: '', preco: '', imagem: null };

const Produto = () => {
    const { getAll, create, update, remove } = useProduto();
    const [produto, setProduto] = useState({ ...produtoVazio });
    const [arquivoImagem, setArquivoImagem] = useState(null);
    const [preview, setPreview] = useState(null);
    const [lstProdutos, setlstProdutos] = useState([]);
    const [erro, setErro] = useState('');
    const [salvando, setSalvando] = useState(false);

    const editando = Boolean(produto.id);

    useEffect(() => {
        async function carregar() {
            try {
                setlstProdutos(await getAll());
            } catch (err) {
                setErro('Não foi possível carregar os produtos. Verifique se a API está em execução.');
            }
        }
        carregar();
    }, [getAll]);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function validateProduto(produto) {
        if (!produto.nome || !produto.nome.trim()) {
            alert("O campo nome é obrigatório");
            return false;
        }
        if (produto.preco === '' || produto.preco === undefined || produto.preco === null) {
            alert("O campo preço é obrigatório");
            return false;
        }
        const valor = Number(produto.preco);
        if (!Number.isFinite(valor)) {
            alert("O campo preço deve ser um número válido");
            return false;
        }
        if (valor < 0) {
            alert("O campo preço não pode ser negativo");
            return false;
        }
        return true;
    }

    function handleChange(e) {
        setProduto({ ...produto, [e.target.name]: e.target.value });
    }

    function handleImagemChange(e) {
        const arquivo = e.target.files && e.target.files[0];
        if (!arquivo) {
            return;
        }
        const extensao = arquivo.name.includes('.') ? arquivo.name.split('.').pop().toLowerCase() : '';
        if (extensao !== 'jpeg' && extensao !== 'png') {
            setErro('Formato de imagem inválido. Envie apenas arquivos .jpeg ou .png.');
            e.target.value = '';
            return;
        }
        setErro('');
        setArquivoImagem(arquivo);
        setPreview(URL.createObjectURL(arquivo));
    }

    function limparFormulario() {
        setProduto({ ...produtoVazio });
        setArquivoImagem(null);
        setPreview(null);
        setErro('');
    }

    async function recarregar() {
        setlstProdutos(await getAll());
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validateProduto(produto)) {
            return;
        }

        setSalvando(true);
        try {
            const dados = new FormData();
            dados.append('nome', produto.nome.trim());
            dados.append('preco', String(Number(produto.preco)));
            if (arquivoImagem) {
                dados.append('imagem', arquivoImagem);
            }

            if (editando) {
                await update(produto.id, dados);
            } else {
                await create(dados);
            }
            await recarregar();
            limparFormulario();
        } catch (err) {
            setErro(err.response?.data?.message || 'Erro ao salvar o produto');
        } finally {
            setSalvando(false);
        }
    }

    function editar(item) {
        setProduto({ id: item.id, nome: item.nome, preco: String(item.preco), imagem: item.imagem });
        setArquivoImagem(null);
        setPreview(urlImagem(item.imagem));
        setErro('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function excluir(item) {
        if (!window.confirm(`Excluir o produto "${item.nome}"?`)) {
            return;
        }
        try {
            await remove(item.id);
            await recarregar();
            if (editando && produto.id === item.id) {
                limparFormulario();
            }
        } catch (err) {
            setErro(err.response?.data?.message || 'Erro ao excluir o produto');
        }
    }

    return (
        <div className="container py-3">
            <h1 className="text-center fs-4 mb-4">Produtos</h1>
            {erro && (
                <div className="alert alert-danger" role="alert">{erro}</div>
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="h5 mb-3">{editando ? 'Editar produto' : 'Novo produto'}</h2>
                    <form onSubmit={handleSubmit}>
                        <InputGroup
                            label="nome"
                            onChange={handleChange}
                            type="text"
                            placeholder="Nome do produto"
                            name="nome"
                            value={produto.nome || ''}
                        />
                        <InputGroup
                            label="preço"
                            onChange={handleChange}
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Preço do produto"
                            name="preco"
                            value={produto.preco || ''}
                        />

                        <div className="mb-3">
                            <label className="form-label" htmlFor="imagem">Imagem (.jpeg ou .png)</label>
                            <input
                                id="imagem"
                                className="form-control"
                                type="file"
                                accept=".jpeg,.png"
                                onChange={handleImagemChange}
                            />
                            <div className="form-text">Formatos aceitos: .jpeg e .png (máximo 5 MB).</div>
                        </div>

                        {preview && (
                            <div className="mb-3">
                                <img
                                    src={preview}
                                    alt="Prévia da imagem do produto"
                                    className="img-thumbnail"
                                    style={{ maxWidth: '140px', maxHeight: '140px', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        <button className="btn btn-primary" type="submit" disabled={salvando}>
                            {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Salvar'}
                        </button>
                        {editando && (
                            <button
                                className="btn btn-outline-secondary ms-2"
                                type="button"
                                onClick={limparFormulario}
                                disabled={salvando}
                            >
                                Cancelar
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <table className="table table-striped table-hover align-middle mt-3">
                <thead>
                    <tr>
                        <th>Imagem</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th className="text-end">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {lstProdutos.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center text-muted">Nenhum produto cadastrado</td>
                        </tr>)
                        : (
                            lstProdutos.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.imagem ? (
                                            <img
                                                src={urlImagem(item.imagem)}
                                                alt={item.nome}
                                                className="rounded"
                                                style={{ width: 48, height: 48, objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span className="text-muted small">Sem imagem</span>
                                        )}
                                    </td>
                                    <td>{item.nome}</td>
                                    <td>{formatarMoeda(item.preco)}</td>
                                    <td className="text-end">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            type="button"
                                            onClick={() => editar(item)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            type="button"
                                            onClick={() => excluir(item)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Produto;
