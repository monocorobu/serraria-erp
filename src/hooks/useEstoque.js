import { useState, useCallback, useMemo } from 'react';
import { DB } from '../services/data.js';
import { ApiClient } from '../services/api.js';

/**
 * Custom Hook: useEstoque
 * Gerenciamento reativo de estoque, inventário, conferência física e sincronização de catálogo
 */
export function useEstoque(showToast) {
  const [products, setProducts] = useState(() => DB.getProdutos());

  // Salvar ou atualizar produto no catálogo
  const saveProduct = useCallback((prod) => {
    const saved = DB.salvarProduto(prod);
    if (!saved) {
      if (showToast) showToast('Não é permitido cadastrar produtos duplicados com o mesmo nome!', 'warning');
      return null;
    }
    setProducts(DB.getProdutos());
    ApiClient.saveProduto(saved).catch(() => {});
    if (showToast) showToast('Produto salvo com sucesso!', 'success');
    return saved;
  }, [showToast]);

  // Excluir produto
  const deleteProduct = useCallback((prodId) => {
    DB.excluirProduto(prodId);
    setProducts(DB.getProdutos());
    ApiClient.deleteProduto(prodId).catch(() => {});
    if (showToast) showToast('Produto removido do catálogo.', 'info');
  }, [showToast]);

  // Ajustar estoque (relativo ou direto)
  const adjustStock = useCallback((prodId, deltaOuValor, ehDireto = false) => {
    const updated = DB.ajustarEstoque(prodId, deltaOuValor, ehDireto);
    setProducts(DB.getProdutos());
    if (updated) {
      ApiClient.saveProduto(updated).catch(() => {});
    }
    return updated;
  }, []);

  // Verificar disponibilidade de estoque antes da venda
  const checkStockAvailability = useCallback((itens) => {
    const itensComProblema = [];
    const prods = DB.getProdutos();

    for (const it of itens) {
      if (!it.produto_id) continue;
      const prod = prods.find(p => p.id === it.produto_id);
      if (!prod) continue;

      const qtdDesejada = it.tipo_calculo === 'ML' 
        ? ((parseFloat(it.quantidade) || 0) * (parseFloat(it.comprimento_m) || 0))
        : (parseFloat(it.quantidade) || 0);

      const saldo = parseFloat(prod.estoque_atual) || 0;
      if (saldo <= 0 || saldo < qtdDesejada) {
        itensComProblema.push({
          produto_id: prod.id,
          codigo: prod.codigo,
          nome: prod.nome,
          saldo_atual: saldo,
          qtd_desejada: qtdDesejada,
          unidade: prod.unidade_medida || 'UN'
        });
      }
    }

    return itensComProblema;
  }, []);

  // KPIs de Estoque
  const metrics = useMemo(() => {
    const totalItens = products.length;
    const itensCriticos = products.filter(p => (parseFloat(p.estoque_atual) || 0) <= (parseFloat(p.estoque_minimo) || 10)).length;
    const itensZerados = products.filter(p => (parseFloat(p.estoque_atual) || 0) <= 0).length;
    const valorTotalEstoque = products.reduce((acc, p) => {
      const qtd = parseFloat(p.estoque_atual) || 0;
      const preco = parseFloat(p.preco_unitario) || 0;
      return acc + (qtd * preco);
    }, 0);

    return {
      totalItens,
      itensCriticos,
      itensZerados,
      valorTotalEstoque
    };
  }, [products]);

  return {
    products,
    setProducts,
    saveProduct,
    deleteProduct,
    adjustStock,
    checkStockAvailability,
    metrics
  };
}
