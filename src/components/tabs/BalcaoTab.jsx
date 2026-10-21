import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';
import { DocMascara, DB } from '../../services/data.js';

export const BalcaoTab = () => {
  const { 
    products, 
    bairros, 
    carpenters, 
    clients, 
    config, 
    saveOrder, 
    showToast, 
    openPrintModal,
    editingOrderId,
    setEditingOrderId,
    orders
  } = useApp();

  // Orçamento Atual em Edição
  const [order, setOrder] = useState(() => ({
    id: 'PED-' + DB.getNextNumeroPedido(),
    numero: DB.getNextNumeroPedido(),
    data_criacao: new Date().toISOString(),
    validade_dias: 7,
    status: 'ORCAMENTO',
    etapa_patio: 'NAO_ENVIADO',
    cliente: {
      id: '',
      nome: '',
      documento: '',
      telefone: '',
      email: '',
      endereco_obra: '',
      bairro: '',
      cidade: 'Caçapava'
    },
    carpinteiro_id: '',
    carpinteiro_nome: '',
    itens: [],
    frete_valor: 0,
    bairro_frete: '',
    desconto_tipo: 'VALOR',
    desconto_valor: 0,
    desconto_autorizado: false,
    forma_pagamento: 'Pix',
    valor_sinal: 0,
    observacoes: ''
  }));

  // Se veio do histórico para editar
  useEffect(() => {
    if (editingOrderId) {
      const found = orders.find(o => o.id === editingOrderId);
      if (found) {
        setOrder({
          ...JSON.parse(JSON.stringify(found)),
          frete_valor: found.resumo_financeiro?.valor_frete || 0,
          bairro_frete: found.resumo_financeiro?.bairro_frete || '',
          desconto_tipo: found.resumo_financeiro?.desconto_tipo || 'VALOR',
          desconto_valor: found.resumo_financeiro?.desconto_valor || 0,
          desconto_autorizado: found.resumo_financeiro?.desconto_autorizado || false,
          forma_pagamento: found.resumo_financeiro?.forma_pagamento || 'Pix',
          valor_sinal: found.resumo_financeiro?.valor_sinal || 0,
          observacoes: found.observacoes_venda || ''
        });
        showToast(`Editando Pedido #${found.numero}`, 'info');
      }
    }
  }, [editingOrderId, orders, showToast]);

  // Listener para evento de novo orçamento
  useEffect(() => {
    const handleNovo = () => {
      setEditingOrderId(null);
      setOrder({
        id: 'PED-' + DB.getNextNumeroPedido(),
        numero: DB.getNextNumeroPedido(),
        data_criacao: new Date().toISOString(),
        validade_dias: 7,
        status: 'ORCAMENTO',
        etapa_patio: 'NAO_ENVIADO',
        cliente: {
          id: '',
          nome: '',
          documento: '',
          telefone: '',
          email: '',
          endereco_obra: '',
          bairro: '',
          cidade: 'Caçapava'
        },
        carpinteiro_id: '',
        carpinteiro_nome: '',
        itens: [],
        frete_valor: 0,
        bairro_frete: '',
        desconto_tipo: 'VALOR',
        desconto_valor: 0,
        desconto_autorizado: false,
        forma_pagamento: 'Pix',
        valor_sinal: 0,
        observacoes: ''
      });
    };

    window.addEventListener('serraria:novo_orcamento', handleNovo);
    return () => window.removeEventListener('serraria:novo_orcamento', handleNovo);
  }, [setEditingOrderId]);

  // Estado da Barra Rápida de Inserção de Produto
  const [fastProductSearch, setFastProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fastQtd, setFastQtd] = useState(1);
  const [fastLargura, setFastLargura] = useState('');
  const [fastComprimento, setFastComprimento] = useState('');
  const [fastPreco, setFastPreco] = useState('0.00');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [senhaGerenteInput, setSenhaGerenteInput] = useState('');

  // Sugestões de produtos filtrados
  const produtosFiltrados = useMemo(() => {
    if (!fastProductSearch.trim()) return products.slice(0, 20);
    const termo = fastProductSearch.toLowerCase();
    return products.filter(p => 
      p.nome.toLowerCase().includes(termo) || 
      p.codigo.toLowerCase().includes(termo) ||
      (p.especie && p.especie.toLowerCase().includes(termo))
    ).slice(0, 20);
  }, [fastProductSearch, products]);

  // Preview de subtotal na barra rápida
  const fastSubtotalPreview = useMemo(() => {
    if (!selectedProduct) return 0;
    const preco = parseFloat(fastPreco) || selectedProduct.preco_unitario || 0;
    const tempItem = {
      quantidade: fastQtd,
      largura_cm: parseFloat(fastLargura) || selectedProduct.largura_cm || 0,
      comprimento_m: parseFloat(fastComprimento) || selectedProduct.comprimento_padrao_m || 0,
      tipo_calculo: selectedProduct.tipo_calculo,
      valor_unitario: preco,
      aparelhar: false
    };
    const c = CalcEngine.calcularItem(tempItem, selectedProduct);
    return c.subtotal;
  }, [selectedProduct, fastQtd, fastLargura, fastComprimento, fastPreco]);

  // Selecionar produto rápido
  const handleSelectFastProduct = (prod) => {
    setSelectedProduct(prod);
    setFastProductSearch(`${prod.codigo} - ${prod.nome}`);
    setFastPreco(prod.preco_unitario !== undefined ? Number(prod.preco_unitario).toFixed(2) : '0.00');
    setIsDropdownOpen(false);
    if (prod.tipo_calculo === 'ML') {
      setFastLargura(prod.largura_cm || '');
      setFastComprimento(prod.comprimento_padrao_m || 3.0);
    } else {
      setFastLargura('');
      setFastComprimento('');
    }
  };

  // Adicionar item ao pedido
  const handleAddItem = (e) => {
    if (e) e.preventDefault();
    if (!selectedProduct) {
      showToast('Selecione um produto da lista antes de adicionar.', 'warning');
      return;
    }

    const qtd = parseFloat(fastQtd) || 0;
    if (qtd <= 0) {
      showToast('Informe uma quantidade válida de peças.', 'warning');
      return;
    }

    const comp = parseFloat(fastComprimento) || selectedProduct.comprimento_padrao_m || 0;
    const larg = parseFloat(fastLargura) || selectedProduct.largura_cm || 0;

    const itemObj = {
      id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      produto_id: selectedProduct.id,
      codigo: selectedProduct.codigo,
      descricao: selectedProduct.nome,
      largura_cm: larg,
      acabamento: 'BRUTA',
      aparelhar: false,
      tipo_calculo: selectedProduct.tipo_calculo,
      quantidade: qtd,
      comprimento_m: selectedProduct.tipo_calculo === 'ML' ? comp : 0,
      valor_unitario: parseFloat(fastPreco) || selectedProduct.preco_unitario || 0
    };

    const calc = CalcEngine.calcularItem(itemObj, selectedProduct);
    Object.assign(itemObj, calc);

    setOrder(prev => ({
      ...prev,
      itens: [...prev.itens, itemObj]
    }));

    showToast(`+ ${itemObj.descricao} adicionado.`);

    // Reset barra rápida
    setSelectedProduct(null);
    setFastProductSearch('');
    setFastQtd(1);
    setFastLargura('');
    setFastComprimento('');
    setFastPreco('0.00');
  };

  // Atualizar item inline (tabela)
  const handleUpdateItemInline = (itemId, field, val) => {
    setOrder(prev => {
      const newItens = prev.itens.map(it => {
        if (it.id !== itemId) return it;
        const prod = products.find(p => p.id === it.produto_id);
        const updated = { ...it, [field]: field === 'aparelhar' ? Boolean(val) : parseFloat(val) || 0 };
        const c = CalcEngine.calcularItem(updated, prod);
        return { ...updated, ...c };
      });
      return { ...prev, itens: newItens };
    });
  };

  // Remover item
  const handleRemoveItem = (itemId) => {
    setOrder(prev => ({
      ...prev,
      itens: prev.itens.filter(i => i.id !== itemId)
    }));
    showToast('Item removido do orçamento.', 'info');
  };

  // Cálculos de Totais em Tempo Real
  const totais = useMemo(() => {
    return CalcEngine.calcularTotaisOrcamento(
      order.itens,
      order.frete_valor,
      order.desconto_valor,
      order.desconto_tipo,
      order.valor_sinal
    );
  }, [order.itens, order.frete_valor, order.desconto_valor, order.desconto_tipo, order.valor_sinal]);

  // Autorização do gerente para desconto
  const handleAutorizarDesconto = () => {
    const senhaEsperada = CalcEngine.getSenhaGerente();
    if (senhaGerenteInput === senhaEsperada) {
      setOrder(prev => ({ ...prev, desconto_autorizado: true }));
      setSenhaGerenteInput('');
      showToast('Desconto autorizado pelo gerente!', 'success');
    } else {
      showToast('Senha do gerente incorreta.', 'error');
    }
  };

  // Botões de pagamento rápido
  const handlePagarTotal = () => {
    setOrder(prev => ({ ...prev, valor_sinal: totais.valor_total }));
  };

  const handlePagarMetade = () => {
    setOrder(prev => ({ ...prev, valor_sinal: parseFloat((totais.valor_total / 2).toFixed(2)) }));
  };

  const handleZerarPagamento = () => {
    setOrder(prev => ({ ...prev, valor_sinal: 0 }));
  };

  // Montar objeto de pedido completo para salvar / imprimir
  const buildCompleteOrder = (statusFinal = 'ORCAMENTO') => {
    if (!order.itens.length) {
      showToast('Adicione pelo menos 1 item antes de prosseguir.', 'warning');
      return null;
    }

    const orderCopy = JSON.parse(JSON.stringify(order));
    orderCopy.status = statusFinal;

    orderCopy.resumo_fisico = {
      total_pecas: totais.total_pecas,
      volume_total_m3: totais.volume_total_m3,
      peso_total_kg: totais.peso_total_kg,
      veiculo_sugerido: totais.veiculo_sugerido
    };

    orderCopy.resumo_financeiro = {
      subtotal_itens_puros: totais.subtotal_itens_puros,
      taxa_aparelhamento: totais.taxa_aparelhamento,
      subtotal_com_plaina: totais.subtotal_com_plaina,
      valor_frete: totais.valor_frete,
      bairro_frete: order.bairro_frete,
      desconto_tipo: order.desconto_tipo,
      desconto_valor: totais.desconto_valor,
      desconto_percentual: totais.desconto_percentual,
      desconto_autorizado: order.desconto_autorizado,
      valor_total: totais.valor_total,
      percentual_bruto: totais.percentual_bruto,
      valor_total_bruto: totais.valor_total_bruto,
      forma_pagamento: order.forma_pagamento,
      valor_sinal: totais.valor_sinal,
      saldo_a_receber: totais.saldo_a_receber
    };

    if (statusFinal === 'APROVADO') {
      const temPlaina = orderCopy.itens.some(i => i.aparelhar);
      orderCopy.etapa_patio = temPlaina ? 'CORTE_PLAINA' : 'SEPARACAO';
      orderCopy.checklist_patio = orderCopy.itens.map(it => ({
        item_id: it.id,
        descricao: `${it.descricao} (${it.quantidade} pcs ${it.largura_cm ? it.largura_cm + 'cm x ' + (it.comprimento_m || 0) + 'm' : ''}) ${it.aparelhar ? '- APARELHAR' : ''}`.trim(),
        cortado: false,
        carregado: false,
        requer_plaina: it.aparelhar
      }));
    } else if (statusFinal === 'ENTREGUE') {
      orderCopy.etapa_patio = 'ENTREGUE';
      orderCopy.finalizado_balcao = true;
      orderCopy.tipo_entrega = 'BALCAO_IMEDIATO';
      orderCopy.data_entrega = new Date().toISOString();
      orderCopy.resumo_financeiro.valor_sinal = orderCopy.resumo_financeiro.valor_total;
      orderCopy.resumo_financeiro.saldo_a_receber = 0;
    }

    return orderCopy;
  };

  const handleSalvarOrcamento = () => {
    const pedido = buildCompleteOrder('ORCAMENTO');
    if (!pedido) return;
    saveOrder(pedido);
    showToast(`Orçamento #${pedido.numero} salvo com sucesso!`, 'success');
  };

  const handleAprovarVenda = () => {
    const pedido = buildCompleteOrder('APROVADO');
    if (!pedido) return;
    saveOrder(pedido);
    showToast(`Venda #${pedido.numero} aprovada e enviada para o Pátio!`, 'success');
  };

  const handleFinalizarBalcao = () => {
    const pedido = buildCompleteOrder('ENTREGUE');
    if (!pedido) return;
    saveOrder(pedido);
    showToast(`Venda Balcão #${pedido.numero} 100% quitada e entregue!`, 'success');
  };

  const handleImprimir = (modo = 'CLIENTE') => {
    const pedido = buildCompleteOrder(order.status || 'ORCAMENTO');
    if (!pedido) return;
    saveOrder(pedido);
    openPrintModal(pedido, modo);
  };

  return (
    <div className="balcao-layout">
      {/* CABEÇALHO DO CLIENTE & DADOS DA OBRA */}
      <div className="panel" style={{ marginBottom: '14px' }}>
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="panel-title">
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Identificação do Cliente, Obra e Parceiro
          </span>
          <span className="badge-tag badge-bruta font-mono" style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px' }}>
            ORÇAMENTO #{order.numero}
          </span>
        </div>

        <div className="panel-body">
          <div className="form-grid form-grid-client-header">
            <div className="form-group">
              <label className="form-label">Nome do Cliente:</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: João da Silva / Construtora Vale"
                value={order.cliente.nome}
                onChange={e => setOrder(prev => ({ ...prev, cliente: { ...prev.cliente, nome: e.target.value } }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefone / WhatsApp:</label>
              <input 
                type="text" 
                className="form-input font-mono" 
                placeholder="(12) 99000-0000"
                value={order.cliente.telefone}
                onChange={e => setOrder(prev => ({ ...prev, cliente: { ...prev.cliente, telefone: DocMascara.formatarTelefone(e.target.value) } }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CPF / CNPJ:</label>
              <input 
                type="text" 
                className="form-input font-mono" 
                placeholder="Somente números"
                value={order.cliente.documento}
                onChange={e => setOrder(prev => ({ ...prev, cliente: { ...prev.cliente, documento: DocMascara.formatar(e.target.value) } }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Local de Entrega / Endereço:</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Rua, Número, Lote ou Condomínio"
                value={order.cliente.endereco_obra}
                onChange={e => setOrder(prev => ({ ...prev, cliente: { ...prev.cliente, endereco_obra: e.target.value } }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bairro:</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Vila Galvão"
                value={order.cliente.bairro}
                onChange={e => setOrder(prev => ({ ...prev, cliente: { ...prev.cliente, bairro: e.target.value } }))}
              />
            </div>
          </div>

          <div className="form-grid form-grid-client-sub">
            <div className="form-group">
              <label className="form-label">Cidade:</label>
              <input 
                type="text" 
                className="form-input" 
                value={order.cliente.cidade || 'Caçapava'}
                onChange={e => setOrder(prev => ({ ...prev, cliente: { ...prev.cliente, cidade: e.target.value } }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Indicação do Carpinteiro:</label>
              <select 
                className="form-select"
                value={order.carpinteiro_id}
                onChange={e => {
                  const carp = carpenters.find(c => c.id === e.target.value);
                  setOrder(prev => ({
                    ...prev,
                    carpinteiro_id: e.target.value,
                    carpinteiro_nome: carp ? carp.nome : ''
                  }));
                }}
              >
                <option value="">Venda Direta (Sem Parceiro)</option>
                {carpenters.map(c => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.especialidade || 'Mestre'})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Instruções para Entrega / Descarga:</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: Acesso por estrada de terra; descarregar somente pela manhã"
                value={order.observacoes || ''}
                onChange={e => setOrder(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO 2: BARRA DE INSERÇÃO RÁPIDA ESTILO LINHA DE MONTAGEM + KITS */}
      <div className="fast-insert-bar">
        <div className="fast-insert-grid">
          {/* Produto / Código (Combobox Inteligente) */}
          <div className="form-group product-combobox-container" id="fast-product-combobox-container">
            <label className="form-label" htmlFor="fast-produto-search">Madeira / Material:</label>
            <div className="product-combobox-input-wrap">
              <span className="combobox-search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input 
                type="text" 
                id="fast-produto-search" 
                className="form-input product-combobox-input" 
                placeholder="Selecione ou digite para buscar produto..." 
                autoComplete="off" 
                spellCheck="false"
                value={fastProductSearch}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={e => {
                  setFastProductSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem();
                  }
                }}
              />
              {fastProductSearch && (
                <button 
                  type="button" 
                  className="combobox-clear-btn" 
                  title="Limpar seleção" 
                  tabIndex="-1"
                  onClick={() => {
                    setFastProductSearch('');
                    setSelectedProduct(null);
                    setFastPreco('0.00');
                  }}
                >
                  &times;
                </button>
              )}
              <button 
                type="button" 
                className="combobox-toggle-btn" 
                title="Abrir lista de produtos" 
                tabIndex="-1"
                onClick={() => setIsDropdownOpen(prev => !prev)}
              >
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            {/* Dropdown Flutuante de Busca Inteligente */}
            {isDropdownOpen && produtosFiltrados.length > 0 && (
              <div id="fast-produto-dropdown" className="product-combobox-dropdown" style={{ display: 'block' }}>
                <div className="combobox-header">
                  <span id="fast-produto-status-text" className="combobox-status-text">
                    <span className="combobox-status-badge"></span>
                    <span id="fast-produto-status-count">{produtosFiltrados.length} itens encontrados</span>
                  </span>
                  <span className="combobox-kbd-hints">
                    <kbd>↵ Enter</kbd> adicionar <kbd>Esc</kbd> fechar
                  </span>
                </div>
                <div id="fast-produto-results" className="combobox-results-list" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {produtosFiltrados.map(p => (
                    <div 
                      key={p.id}
                      className="combobox-item"
                      onClick={() => handleSelectFastProduct(p)}
                      style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}
                    >
                      <span>
                        <strong className="font-mono" style={{ color: 'var(--brand-primary)' }}>{p.codigo}</strong> - {p.nome}
                      </span>
                      <span className="font-mono" style={{ fontWeight: 700 }}>
                        {CalcEngine.formatBRL(p.preco_unitario)}/{p.tipo_calculo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantidade */}
          <div className="form-group">
            <label className="form-label" id="fast-qtd-label">Qtd Peças:</label>
            <input 
              type="number" 
              id="fast-qtd-input" 
              className="form-input font-mono" 
              min="1" 
              step="1" 
              value={fastQtd}
              onChange={e => setFastQtd(Math.max(1, parseInt(e.target.value) || 1))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
            />
          </div>

          {/* Largura da Madeira (cm) */}
          <div className="form-group">
            <label className="form-label" id="fast-largura-label">Largura (cm):</label>
            <input 
              type="number" 
              id="fast-largura-input" 
              className="form-input font-mono" 
              min="0.5" 
              step="0.5" 
              placeholder="Ex: 15"
              value={fastLargura}
              onChange={e => setFastLargura(e.target.value)}
              disabled={selectedProduct && selectedProduct.tipo_calculo !== 'ML'}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
            />
          </div>

          {/* Comprimento */}
          <div className="form-group">
            <label className="form-label" id="fast-comp-label">Comprimento (m):</label>
            <input 
              type="number" 
              id="fast-comprimento-input" 
              className="form-input font-mono" 
              min="0.1" 
              step="0.1" 
              placeholder="Ex: 3.0"
              value={fastComprimento}
              onChange={e => setFastComprimento(e.target.value)}
              disabled={selectedProduct && selectedProduct.tipo_calculo !== 'ML'}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
            />
          </div>

          {/* Preço Unitário */}
          <div className="form-group">
            <label className="form-label">Preço Unit. (R$):</label>
            <input 
              type="number" 
              id="fast-preco-input" 
              className="form-input font-mono" 
              step="0.50" 
              value={fastPreco}
              onChange={e => setFastPreco(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
            />
          </div>

          {/* Subtotal Preview */}
          <div className="form-group">
            <label className="form-label">Subtotal:</label>
            <div 
              id="fast-subtotal-preview" 
              className="form-input font-mono" 
              style={{ backgroundColor: 'var(--bg-surface-subtle)', fontWeight: 700, color: 'var(--brand-primary-text)', lineHeight: '20px' }}
            >
              {CalcEngine.formatBRL(fastSubtotalPreview)}
            </div>
          </div>

          {/* Botão Adicionar */}
          <div className="form-group">
            <button 
              type="button" 
              className="btn btn-primary" 
              id="fast-add-btn" 
              style={{ width: '100%', height: '38px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={handleAddItem}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Adicionar</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABELA DE ITENS DO ORÇAMENTO */}
      <div className="panel" style={{ marginTop: '14px', marginBottom: '14px' }}>
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="panel-title">
            <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Itens do Orçamento ({order.itens.length})
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Edição direta na grade: altere peças, largura ou plaina e recalcule na hora
          </span>
        </div>

        <div className="table-responsive">
          <table className="dense-table">
            <thead>
              <tr>
                <th style={{ width: '35px' }} className="align-center">#</th>
                <th style={{ width: '75px' }}>Código</th>
                <th>Descrição do Produto / Bitola</th>
                <th style={{ width: '50px' }} className="align-center">Unid.</th>
                <th style={{ width: '85px' }} className="align-center">Qtd Peças</th>
                <th style={{ width: '90px' }} className="align-center">Largura (cm)</th>
                <th style={{ width: '85px' }} className="align-center">Compr. (m)</th>
                <th style={{ width: '90px' }} className="align-center">Plaina</th>
                <th style={{ width: '95px' }} className="align-right">Metragem</th>
                <th style={{ width: '100px' }} className="align-right">Valor Unit.</th>
                <th style={{ width: '110px' }} className="align-right">Subtotal</th>
                <th style={{ width: '50px' }} className="align-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {order.itens.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    Nenhum item adicionado ainda. Utilize a barra rápida acima para adicionar produtos.
                  </td>
                </tr>
              ) : (
                order.itens.map((it, idx) => {
                  const prod = products.find(p => p.id === it.produto_id);
                  const estoqueAtual = prod ? parseFloat(prod.estoque_atual) || 0 : null;
                  return (
                    <tr key={it.id}>
                      <td className="align-center font-mono" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{idx + 1}</td>
                      <td className="font-mono" style={{ fontWeight: 600, color: 'var(--primary-green)' }}>{it.codigo}</td>
                      <td>
                        <strong>{it.descricao}</strong>
                        {estoqueAtual !== null && (
                          <div style={{ fontSize: '10.5px', marginTop: '2px' }}>
                            {estoqueAtual <= 0 ? (
                              <span style={{ color: '#DC2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <svg viewBox="0 0 24 24" width="11" height="11" stroke="#DC2626" fill="none" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Zerado em estoque
                              </span>
                            ) : it.quantidade > estoqueAtual ? (
                              <span style={{ color: '#D97706', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <svg viewBox="0 0 24 24" width="11" height="11" stroke="#D97706" fill="none" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Qtd ({it.quantidade}) &gt; Estoque ({estoqueAtual})
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>Estoque: {estoqueAtual} un</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="align-center font-mono">{it.tipo_calculo}</td>
                      <td>
                        <input 
                          type="number" 
                          min="1" 
                          className="table-input" 
                          value={it.quantidade} 
                          onChange={e => handleUpdateItemInline(it.id, 'quantidade', e.target.value)} 
                        />
                      </td>
                      <td className="align-center">
                        {it.tipo_calculo === 'ML' ? (
                          <input 
                            type="number" 
                            step="0.5" 
                            className="table-input" 
                            value={it.largura_cm || ''} 
                            onChange={e => handleUpdateItemInline(it.id, 'largura_cm', e.target.value)} 
                          />
                        ) : '-'}
                      </td>
                      <td className="align-center">
                        {it.tipo_calculo === 'ML' ? (
                          <input 
                            type="number" 
                            step="0.5" 
                            className="table-input" 
                            value={it.comprimento_m || ''} 
                            onChange={e => handleUpdateItemInline(it.id, 'comprimento_m', e.target.value)} 
                          />
                        ) : '-'}
                      </td>
                      <td className="align-center">
                        <input 
                          type="checkbox" 
                          checked={Boolean(it.aparelhar)} 
                          onChange={e => handleUpdateItemInline(it.id, 'aparelhar', e.target.checked)} 
                        />
                      </td>
                      <td className="align-right font-mono">
                        {it.metragem_total} {it.tipo_calculo === 'ML' ? 'ML' : (it.tipo_calculo === 'M2' ? 'm²' : 'un')}
                      </td>
                      <td className="align-right font-mono">{CalcEngine.formatBRL(it.valor_unitario)}</td>
                      <td className="align-right font-mono" style={{ fontWeight: 700 }}>
                        {CalcEngine.formatBRL(it.subtotal)}
                      </td>
                      <td className="align-center">
                        <button 
                          className="btn-trash" 
                          title="Remover Item" 
                          onClick={() => handleRemoveItem(it.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOCO DE FECHAMENTO FINANCEIRO E DUAL PRICING */}
      <div className="order-footer-grid">
        <div className="summary-card highlight">
          <div className="summary-title">
            <span>Fechamento Financeiro</span>
            <span>Moeda Corrente (BRL)</span>
          </div>

          <div className="summary-row">
            <span>Subtotal dos Itens:</span>
            <span className="font-mono" style={{ fontWeight: 600 }}>{CalcEngine.formatBRL(totais.subtotal_itens_puros)}</span>
          </div>

          <div className="summary-row">
            <span>(+) Taxa de Plaina (Beneficiamento):</span>
            <span className="font-mono" style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{CalcEngine.formatBRL(totais.taxa_aparelhamento)}</span>
          </div>

          <div className="summary-row" style={{ marginTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>(+) Frete por Bairro:</span>
              <select 
                className="form-select" 
                style={{ height: '28px', padding: '2px 8px', fontSize: '12px', width: '170px' }}
                value={order.bairro_frete}
                onChange={e => {
                  const b = bairros.find(item => item.nome === e.target.value);
                  setOrder(prev => ({
                    ...prev,
                    bairro_frete: e.target.value,
                    frete_valor: b ? b.valor : prev.frete_valor
                  }));
                }}
              >
                <option value="">Selecione o Bairro...</option>
                {bairros.map(b => (
                  <option key={b.nome} value={b.nome}>{b.nome} ({CalcEngine.formatBRL(b.valor)})</option>
                ))}
              </select>
            </span>
            <span style={{ width: '100px' }}>
              <input 
                type="number" 
                className="form-input font-mono" 
                style={{ height: '28px', padding: '2px 8px' }}
                value={order.frete_valor}
                onChange={e => setOrder(prev => ({ ...prev, frete_valor: parseFloat(e.target.value) || 0 }))}
              />
            </span>
          </div>

          <div className="summary-row" style={{ marginTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>(-) Desconto Comercial:</span>
              <select 
                className="form-select" 
                style={{ height: '28px', padding: '2px 8px', fontSize: '12px', width: '75px' }}
                value={order.desconto_tipo}
                onChange={e => setOrder(prev => ({ ...prev, desconto_tipo: e.target.value }))}
              >
                <option value="VALOR">R$</option>
                <option value="PCT">%</option>
              </select>
            </span>
            <span style={{ width: '100px' }}>
              <input 
                type="number" 
                className="form-input font-mono" 
                style={{ height: '28px', padding: '2px 8px' }}
                value={order.desconto_valor}
                onChange={e => setOrder(prev => ({ ...prev, desconto_valor: parseFloat(e.target.value) || 0 }))}
              />
            </span>
          </div>

          {/* TRAVA DE SEGURANÇA DESCONTO > 5% */}
          {totais.requer_autorizacao && !order.desconto_autorizado && (
            <div style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid var(--warning-border)', padding: '8px 12px', marginTop: '6px', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
              <div style={{ fontWeight: 700, color: 'var(--warning-text)', marginBottom: '4px' }}>
                Segurança: Desconto acima do teto exige senha do gerente.
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="password" 
                  className="form-input font-mono" 
                  placeholder="Senha (1234)" 
                  style={{ height: '28px', width: '150px' }}
                  value={senhaGerenteInput}
                  onChange={e => setSenhaGerenteInput(e.target.value)}
                />
                <button type="button" className="btn btn-sm btn-primary" onClick={handleAutorizarDesconto}>
                  Liberar Desconto
                </button>
              </div>
            </div>
          )}

          {/* CONTAINER DE PREÇO DUPLO (VALOR À VISTA & PREÇO BRUTO COM % DO GERENTE) */}
          <div className="summary-duo-container">
            <div className="summary-row grand-total" style={{ margin: 0, padding: 0, border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#047857' }}>VALOR À VISTA:</span>
                <span className="badge-tag" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #10B981', fontSize: '10px', padding: '1px 6px', fontWeight: 700 }}>
                  PIX / DINHEIRO
                </span>
              </div>
              <span className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: '#047857' }}>
                {CalcEngine.formatBRL(totais.valor_total)}
              </span>
            </div>

            <div className="summary-row" style={{ padding: '6px 10px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E40AF' }}>PREÇO BRUTO:</span>
                <span className="badge-tag" style={{ background: '#DBEAFE', color: '#1E40AF', border: '1px solid #93C5FD', fontSize: '10px', padding: '1px 6px', fontWeight: 700 }}>
                  A PRAZO (+{totais.percentual_bruto}%)
                </span>
              </div>
              <span className="font-mono" style={{ fontSize: '15px', fontWeight: 800, color: '#1E40AF' }}>
                {CalcEngine.formatBRL(totais.valor_total_bruto)}
              </span>
            </div>
          </div>

          {/* CONDIÇÃO DE PAGAMENTO & ENTRADA */}
          <div className="balcao-totals-split" style={{ marginTop: '10px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Condição de Pagamento:</label>
              <select 
                className="form-select" 
                style={{ height: '34px' }}
                value={order.forma_pagamento}
                onChange={e => setOrder(prev => ({ ...prev, forma_pagamento: e.target.value }))}
              >
                <option value="Pix">Pix (Instantâneo)</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Boleto Bancário">Boleto Bancário</option>
                <option value="Conta Corrente / Pendura">Conta Corrente / Pendura</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Valor Pago / Entrada:</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button type="button" className="btn btn-sm" onClick={handlePagarTotal} style={{ height: '22px', padding: '0 6px', fontSize: '10px', background: '#ECFDF5', border: '1px solid #10B981', color: '#047857', fontWeight: 700 }}>
                    100% Total
                  </button>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={handlePagarMetade} style={{ height: '22px', padding: '0 6px', fontSize: '10px' }}>
                    50%
                  </button>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={handleZerarPagamento} style={{ height: '22px', padding: '0 6px', fontSize: '10px' }}>
                    Zerar
                  </button>
                </div>
              </div>
              <input 
                type="number" 
                className="form-input font-mono" 
                style={{ height: '34px' }}
                value={order.valor_sinal}
                onChange={e => setOrder(prev => ({ ...prev, valor_sinal: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          {/* SALDO A RECEBER */}
          <div className="summary-row balance-due" style={{ marginTop: '10px' }}>
            <span>SALDO A RECEBER NA ENTREGA:</span>
            <span className="font-mono">
              {totais.saldo_a_receber <= 0 && totais.valor_total > 0 ? (
                <span style={{ color: '#059669', fontWeight: 800 }}>R$ 0,00 (100% QUITADO)</span>
              ) : (
                CalcEngine.formatBRL(totais.saldo_a_receber)
              )}
            </span>
          </div>
        </div>
      </div>

      {/* BARRA DE AÇÕES DO BALCÃO */}
      <div className="order-actions-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-lg" 
            onClick={handleFinalizarBalcao}
            style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#FFFFFF', fontWeight: 700, border: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>Finalizar Venda Balcão (Pago & Entregue Já)</span>
          </button>
          <button type="button" className="btn btn-primary btn-lg" onClick={handleAprovarVenda}>
            Aprovar Venda (Enviar p/ Pátio)
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleSalvarOrcamento}>
            Salvar Orçamento
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => handleImprimir('CLIENTE')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            <span>Imprimir Orçamento (A5)</span>
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => handleImprimir('PATIO')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            <span>Romaneio Pátio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
