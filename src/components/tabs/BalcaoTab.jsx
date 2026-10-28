import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';
import { DocMascara, DB } from '../../services/data.js';
import Pagination from '../common/Pagination.jsx';

// Componente que destaca as letras e termos que batem com a pesquisa
const HighlightText = ({ text, query }) => {
  if (!text) return null;
  if (!query || typeof query !== 'string' || !query.trim()) return <>{text}</>;

  const removeAccents = (str) =>
    (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const words = query
    .trim()
    .split(/\s+/)
    .map(w => removeAccents(w))
    .filter(w => w.length > 0);

  if (words.length === 0) return <>{text}</>;

  const normText = removeAccents(text);
  const mask = new Array(text.length).fill(false);

  words.forEach(word => {
    let startIdx = 0;
    while ((startIdx = normText.indexOf(word, startIdx)) !== -1) {
      const endIdx = Math.min(startIdx + word.length, text.length);
      for (let i = startIdx; i < endIdx; i++) {
        mask[i] = true;
      }
      startIdx += word.length;
    }
  });

  const parts = [];
  let currentChunk = '';
  let currentIsHighlight = mask[0] || false;

  for (let i = 0; i < text.length; i++) {
    if (mask[i] === currentIsHighlight) {
      currentChunk += text[i];
    } else {
      if (currentChunk) {
        parts.push({ text: currentChunk, highlight: currentIsHighlight });
      }
      currentChunk = text[i];
      currentIsHighlight = mask[i];
    }
  }
  if (currentChunk) {
    parts.push({ text: currentChunk, highlight: currentIsHighlight });
  }

  return (
    <>
      {parts.map((p, idx) =>
        p.highlight ? (
          <mark
            key={idx}
            style={{
              backgroundColor: '#FEF08A',
              color: '#854D0E',
              padding: '0 2px',
              borderRadius: '2px',
              fontWeight: 700
            }}
          >
            {p.text}
          </mark>
        ) : (
          <span key={idx}>{p.text}</span>
        )
      )}
    </>
  );
};

export const BalcaoTab = () => {
  const {
    products,
    bairros,
    carpenters,
    clients,
    saveClient,
    config,
    saveOrder,
    showToast,
    openPrintModal,
    editingOrderId,
    setEditingOrderId,
    orders,
    employees,
    currentUser,
    isAdmin,
    generateWhatsAppText
  } = useApp();

  const [mostrarCarpinteiro, setMostrarCarpinteiro] = useState(false);
  const [expandirDadosEntrega, setExpandirDadosEntrega] = useState(true);

  // Vendedor padrão ativo (prioriza o usuário logado se for funcionário, ou primeiro vendedor)
  const defaultSeller = useMemo(() => {
    if (!employees || employees.length === 0) return null;
    return employees.find(e => e.id === currentUser?.funcionario_id || e.nome === currentUser?.nome) ||
      employees.find(e => (e.cargo || '').toLowerCase().includes('vendedor')) ||
      employees[0] || null;
  }, [employees, currentUser]);

  // Orçamento Atual em Edição
  const [order, setOrder] = useState(() => ({
    id: 'PED-' + DB.getNextNumeroPedido(),
    numero: DB.getNextNumeroPedido(),
    data_criacao: new Date().toISOString(),
    validade_dias: 7,
    status: 'ORCAMENTO',
    etapa_patio: 'NAO_ENVIADO',
    vendedor_id: '',
    vendedor_nome: '',
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
    plaina_pct: 0,
    plaina_base: 'ITENS_PLAINA',
    desconto_tipo: 'VALOR',
    desconto_valor: 0,
    desconto_autorizado: false,
    forma_pagamento: 'Pix',
    cartao_parcelas: 1,
    pagamento_dividido: false,
    pagamentos: [
      { id: 'pag_1', tipo: 'Pix', valor: 0, parcelas: 1 }
    ],
    valor_sinal: 0,
    observacoes: ''
  }));

  // Paginação dos Itens da Comanda/Orçamento
  const [itemsCurrentPage, setItemsCurrentPage] = useState(1);
  const [itemsPageSize, setItemsPageSize] = useState(10);
  const totalItemsPages = Math.max(1, Math.ceil((order.itens?.length || 0) / itemsPageSize));
  const safeItemsCurrentPage = Math.min(Math.max(1, itemsCurrentPage), totalItemsPages);
  const paginatedItens = useMemo(() => {
    const list = order.itens || [];
    const start = (safeItemsCurrentPage - 1) * itemsPageSize;
    return list.slice(start, start + itemsPageSize);
  }, [order.itens, safeItemsCurrentPage, itemsPageSize]);

  // Define vendedor inicial quando a lista de funcionários estiver pronta
  useEffect(() => {
    if (!order.vendedor_id && defaultSeller) {
      setOrder(prev => ({
        ...prev,
        vendedor_id: defaultSeller.id,
        vendedor_nome: defaultSeller.nome
      }));
    }
  }, [defaultSeller, order.vendedor_id]);

  // Se veio do histórico para editar
  useEffect(() => {
    if (editingOrderId) {
      const found = orders.find(o => o.id === editingOrderId);
      if (found) {
        setOrder({
          ...JSON.parse(JSON.stringify(found)),
          vendedor_id: found.vendedor_id || found.comissao_vendedor_id || (defaultSeller ? defaultSeller.id : ''),
          vendedor_nome: found.vendedor_nome || found.comissao_vendedor_nome || (defaultSeller ? defaultSeller.nome : ''),
          frete_valor: found.resumo_financeiro?.valor_frete || 0,
          bairro_frete: found.resumo_financeiro?.bairro_frete || '',
          plaina_pct: found.plaina_pct ?? found.resumo_financeiro?.plaina_pct ?? 0,
          plaina_base: found.plaina_base ?? found.resumo_financeiro?.plaina_base ?? 'ITENS_PLAINA',
          desconto_tipo: found.resumo_financeiro?.desconto_tipo || 'VALOR',
          desconto_valor: found.resumo_financeiro?.desconto_valor || 0,
          desconto_autorizado: found.resumo_financeiro?.desconto_autorizado || false,
          forma_pagamento: found.resumo_financeiro?.forma_pagamento || found.forma_pagamento || 'Pix',
          cartao_parcelas: found.resumo_financeiro?.cartao_parcelas || found.cartao_parcelas || 1,
          pagamento_dividido: Boolean(found.resumo_financeiro?.pagamento_dividido || found.pagamento_dividido),
          pagamentos: (found.resumo_financeiro?.pagamentos_detalhe && found.resumo_financeiro.pagamentos_detalhe.length > 0)
            ? found.resumo_financeiro.pagamentos_detalhe.map((pg, idx) => ({ id: `pag_${idx + 1}`, tipo: pg.tipo || 'Pix', valor: pg.valor || 0, parcelas: pg.parcelas || 1 }))
            : (found.pagamentos || [{ id: 'pag_1', tipo: found.forma_pagamento || 'Pix', valor: found.resumo_financeiro?.valor_total || 0, parcelas: found.cartao_parcelas || 1 }]),
          valor_sinal: found.resumo_financeiro?.valor_sinal || 0,
          observacoes: found.observacoes_venda || ''
        });
        showToast(`Editando Pedido #${found.numero}`, 'info');
      }
    }
  }, [editingOrderId, orders, defaultSeller, showToast]);

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
        vendedor_id: defaultSeller ? defaultSeller.id : '',
        vendedor_nome: defaultSeller ? defaultSeller.nome : '',
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
        plaina_pct: 0,
        plaina_base: 'ITENS_PLAINA',
        desconto_tipo: 'VALOR',
        desconto_valor: 0,
        desconto_autorizado: false,
        forma_pagamento: 'Pix',
        cartao_parcelas: 1,
        pagamento_dividido: false,
        pagamentos: [
          { id: 'pag_1', tipo: 'Pix', valor: 0, parcelas: 1 }
        ],
        valor_sinal: 0,
        observacoes: ''
      });
      setMostrarCarpinteiro(false);
    };

    window.addEventListener('serraria:novo_orcamento', handleNovo);
    return () => window.removeEventListener('serraria:novo_orcamento', handleNovo);
  }, [defaultSeller, setEditingOrderId]);

  // Estado da Barra Rápida de Inserção de Produto
  const [fastProductSearch, setFastProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [fastQtd, setFastQtd] = useState(1);
  const [fastLargura, setFastLargura] = useState('');
  const [fastComprimento, setFastComprimento] = useState('');
  const [fastPreco, setFastPreco] = useState('0.00');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [senhaGerenteInput, setSenhaGerenteInput] = useState('');
  const productComboboxRef = useRef(null);
  const fastProductSearchInputRef = useRef(null);
  const fastQtdInputRef = useRef(null);
  const fastLarguraInputRef = useRef(null);
  const fastCompInputRef = useRef(null);
  const fastPrecoInputRef = useRef(null);
  const fastAddBtnRef = useRef(null);

  // Foco com seleção automática para agilizar digitação contínua
  const focusInput = (ref) => {
    if (ref && ref.current) {
      ref.current.focus();
      if (typeof ref.current.select === 'function') {
        ref.current.select();
      }
    }
  };

  // Autocomplete e busca de clientes cadastrados
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const clientAutocompleteRef = useRef(null);

  // Função auxiliar para normalização de texto sem acentos
  const normalizeText = (text) => {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Filtragem de clientes em tempo real (busca inteligente por nome, telefone, documento ou bairro)
  const matchingClients = useMemo(() => {
    const termoBruto = (order.cliente?.nome || '').trim();
    if (!termoBruto) return [];
    const termoNorm = normalizeText(termoBruto);
    const digitsOnly = termoBruto.replace(/\D/g, '');

    return clients.filter(c => {
      const nomeMatch = Boolean(c.nome && normalizeText(c.nome).includes(termoNorm));
      const bairroMatch = Boolean(c.bairro && normalizeText(c.bairro).includes(termoNorm));
      // Telefone e CPF só filtram se o usuário digitou dígitos numéricos
      const telMatch = Boolean(digitsOnly.length >= 2 && c.telefone && c.telefone.replace(/\D/g, '').includes(digitsOnly));
      const docMatch = Boolean(digitsOnly.length >= 3 && c.documento && c.documento.replace(/\D/g, '').includes(digitsOnly));
      return nomeMatch || bairroMatch || telMatch || docMatch;
    }).slice(0, 8);
  }, [order.cliente?.nome, clients]);

  // Fechar dropdowns de clientes e produtos ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (clientAutocompleteRef.current && !clientAutocompleteRef.current.contains(e.target)) {
        setIsClientDropdownOpen(false);
      }
      if (productComboboxRef.current && !productComboboxRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Selecionar cliente do autocomplete
  const handleSelectClient = (c) => {
    setOrder(prev => {
      const updated = {
        ...prev,
        cliente: {
          id: c.id || '',
          nome: c.nome || '',
          telefone: c.telefone || '',
          documento: c.documento || '',
          email: c.email || '',
          endereco_obra: c.endereco_obra || '',
          bairro: c.bairro || '',
          cidade: c.cidade || 'Caçapava'
        }
      };

      // Se o cliente tem bairro cadastrado, pré-seleciona no frete
      if (c.bairro) {
        const matchingBairro = bairros.find(b => b.nome.toLowerCase() === c.bairro.toLowerCase());
        if (matchingBairro) {
          updated.bairro_frete = matchingBairro.nome;
          updated.frete_valor = matchingBairro.valor || 0;
        } else {
          updated.bairro_frete = c.bairro;
        }
      }

      return updated;
    });

    setIsClientDropdownOpen(false);
    showToast(`Cliente selecionado: ${c.nome}`);
  };

  // Sugestões de produtos filtrados com busca multi-termos sem acentos e priorização de prefixo
  const produtosFiltrados = useMemo(() => {
    const rawTerm = fastProductSearch.trim();
    if (!rawTerm) return products.slice(0, 35);

    const removeAccents = (str) =>
      (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    // Se o texto é exatamente o produto selecionado, mostra catálogo padrão
    if (selectedProduct && `${selectedProduct.codigo} - ${selectedProduct.nome}` === rawTerm) {
      return products.slice(0, 35);
    }

    const searchTokens = rawTerm
      .split(/\s+/)
      .map(t => removeAccents(t))
      .filter(Boolean);

    if (searchTokens.length === 0) return products.slice(0, 35);

    return products
      .filter(p => {
        const pCats = Array.isArray(p.categorias) ? p.categorias : (p.categoria ? [p.categoria] : []);
        const targetStr = removeAccents(
          `${p.codigo || ''} ${p.nome || ''} ${p.especie || ''} ${pCats.join(' ')} ${p.tipo_calculo || ''} ${p.descricao || ''}`
        );

        // Todos os termos digitados devem estar presentes
        return searchTokens.every(token => targetStr.includes(token));
      })
      .sort((a, b) => {
        const aCode = removeAccents(a.codigo);
        const bCode = removeAccents(b.codigo);
        const aNome = removeAccents(a.nome);
        const bNome = removeAccents(b.nome);
        const firstToken = searchTokens[0];

        // 1. Prioridade para código começando com o termo
        const aCodeStarts = aCode.startsWith(firstToken);
        const bCodeStarts = bCode.startsWith(firstToken);
        if (aCodeStarts && !bCodeStarts) return -1;
        if (!aCodeStarts && bCodeStarts) return 1;

        // 2. Prioridade para nome começando com o termo
        const aNomeStarts = aNome.startsWith(firstToken);
        const bNomeStarts = bNome.startsWith(firstToken);
        if (aNomeStarts && !bNomeStarts) return -1;
        if (!aNomeStarts && bNomeStarts) return 1;

        return 0;
      })
      .slice(0, 40);
  }, [fastProductSearch, products, selectedProduct]);

  // Identifica se o produto selecionado exige medidas de corte (ML)
  const isMadeiraLinear = Boolean(selectedProduct && selectedProduct.tipo_calculo === 'ML');

  // Preview de subtotal na barra rápida
  const fastSubtotalPreview = useMemo(() => {
    if (!selectedProduct) return 0;
    const preco = parseFloat(fastPreco) || selectedProduct.preco_unitario || 0;
    const isML = selectedProduct.tipo_calculo === 'ML';
    const tempItem = {
      quantidade: fastQtd,
      largura_cm: isML ? (parseFloat(fastLargura) || selectedProduct.largura_cm || 0) : 0,
      comprimento_m: isML ? (parseFloat(fastComprimento) || selectedProduct.comprimento_padrao_m || 0) : 0,
      tipo_calculo: selectedProduct.tipo_calculo || 'UN',
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
      setFastLargura('-');
      setFastComprimento('-');
    }

    // Foco automático e conversa fluida: pula direto para a Quantidade
    setTimeout(() => {
      if (fastQtdInputRef.current) {
        fastQtdInputRef.current.focus();
        fastQtdInputRef.current.select();
      }
    }, 60);
  };

  // Adicionar item avulso que não está no catálogo
  const handleAdicionarItemAvulso = (nomeItem) => {
    const nomeLimpo = (nomeItem || fastProductSearch || '').trim();
    if (!nomeLimpo) {
      showToast('Digite a descrição do produto a adicionar.', 'warning');
      return;
    }
    const itemCustom = {
      id: 'custom_' + Date.now(),
      codigo: 'AVULSO',
      nome: nomeLimpo,
      preco_unitario: 0,
      tipo_calculo: 'UN',
      estoque_atual: 999
    };
    setSelectedProduct(itemCustom);
    setFastProductSearch(nomeLimpo);
    setFastPreco('0.00');
    setFastLargura('-');
    setFastComprimento('-');
    setIsDropdownOpen(false);
    setTimeout(() => {
      if (fastPrecoInputRef.current) {
        fastPrecoInputRef.current.focus();
        fastPrecoInputRef.current.select();
      }
    }, 60);
    showToast(`"${nomeLimpo}" selecionado como item avulso. Informe o preço unitário e a quantidade.`, 'info');
  };

  // Adicionar item ao pedido
  const handleAddItem = (e) => {
    if (e) e.preventDefault();
    if (!selectedProduct) {
      if (fastProductSearch.trim()) {
        handleAdicionarItemAvulso(fastProductSearch);
        return;
      }
      showToast('Selecione ou digite um produto antes de adicionar.', 'warning');
      return;
    }

    const qtd = parseFloat(fastQtd) || 0;
    if (qtd <= 0) {
      showToast('Informe uma quantidade válida de peças.', 'warning');
      return;
    }

    const isML = selectedProduct.tipo_calculo === 'ML';
    const comp = isML ? (parseFloat(fastComprimento) || selectedProduct.comprimento_padrao_m || 0) : 0;
    const larg = isML ? (parseFloat(fastLargura) || selectedProduct.largura_cm || 0) : 0;

    const itemObj = {
      id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      produto_id: selectedProduct.id,
      codigo: selectedProduct.codigo || 'AVULSO',
      descricao: selectedProduct.nome,
      largura_cm: larg,
      acabamento: 'BRUTA',
      aparelhar: false,
      tipo_calculo: selectedProduct.tipo_calculo || 'UN',
      quantidade: qtd,
      comprimento_m: comp,
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

    // Retorna o foco para a busca de produto para digitar o próximo item
    setTimeout(() => {
      focusInput(fastProductSearchInputRef);
    }, 60);
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
      0,
      order.plaina_pct,
      order.plaina_base
    );
  }, [order.itens, order.frete_valor, order.desconto_valor, order.desconto_tipo, order.plaina_pct, order.plaina_base]);

  // Autorização do gerente para desconto
  const handleAutorizarDesconto = () => {
    const senhaEsperada = String(config.senha_gerente || CalcEngine.getSenhaGerente() || '1234').trim();
    if (String(senhaGerenteInput).trim() === senhaEsperada) {
      setOrder(prev => ({ ...prev, desconto_autorizado: true }));
      setSenhaGerenteInput('');
      showToast('Desconto autorizado pelo gerente com sucesso!', 'success');
    } else {
      showToast('Senha do gerente incorreta. Verifique a senha configurada na Central do Gerente.', 'error');
    }
  };

  // Funções de gerenciamento de pagamentos múltiplos / divididos
  const handleTogglePagamentoDividido = (dividido) => {
    setOrder(prev => {
      if (!dividido) {
        return {
          ...prev,
          pagamento_dividido: false
        };
      }
      let currentPags = prev.pagamentos && prev.pagamentos.length >= 2 ? prev.pagamentos : null;
      if (!currentPags) {
        const valTotal = totais.valor_total || 0;
        const metade = parseFloat((valTotal / 2).toFixed(2));
        const resto = parseFloat((valTotal - metade).toFixed(2));
        currentPags = [
          { id: 'pag_1', tipo: 'Pix', valor: metade, parcelas: 1 },
          { id: 'pag_2', tipo: 'Cartão de Crédito', valor: resto, parcelas: 1 }
        ];
      }
      return {
        ...prev,
        pagamento_dividido: true,
        pagamentos: currentPags
      };
    });
  };

  const handleUpdatePaymentLine = (id, field, value) => {
    setOrder(prev => {
      const updatedPags = (prev.pagamentos || []).map(pg => {
        if (pg.id !== id) return pg;
        if (field === 'valor') {
          return { ...pg, valor: Math.max(0, parseFloat(value) || 0) };
        }
        if (field === 'parcelas') {
          return { ...pg, parcelas: Math.min(5, Math.max(1, parseInt(value) || 1)) };
        }
        if (field === 'tipo') {
          return {
            ...pg,
            tipo: value,
            parcelas: value === 'Cartão de Crédito' ? (pg.parcelas || 1) : 1
          };
        }
        return { ...pg, [field]: value };
      });
      return { ...prev, pagamentos: updatedPags };
    });
  };

  const handleAddPaymentLine = () => {
    setOrder(prev => {
      const currentPags = prev.pagamentos || [];
      const currentTotal = currentPags.reduce((acc, p) => acc + (parseFloat(p.valor) || 0), 0);
      const restante = Math.max(0, parseFloat((totais.valor_total - currentTotal).toFixed(2)));
      const nextId = `pag_${Date.now()}`;
      const existingTypes = currentPags.map(p => p.tipo);
      const possibleTypes = ['Pix', 'Cartão de Crédito', 'Dinheiro', 'Cartão de Débito'];
      const suggestedType = possibleTypes.find(t => !existingTypes.includes(t)) || 'Cartão de Crédito';
      return {
        ...prev,
        pagamentos: [
          ...currentPags,
          { id: nextId, tipo: suggestedType, valor: restante, parcelas: 1 }
        ]
      };
    });
  };

  const handleRemovePaymentLine = (id) => {
    setOrder(prev => {
      if ((prev.pagamentos || []).length <= 1) return prev;
      return {
        ...prev,
        pagamentos: prev.pagamentos.filter(p => p.id !== id)
      };
    });
  };

  const handleAutofillRemaining = (id) => {
    setOrder(prev => {
      const currentPags = prev.pagamentos || [];
      const othersTotal = currentPags
        .filter(p => p.id !== id)
        .reduce((acc, p) => acc + (parseFloat(p.valor) || 0), 0);
      const rest = Math.max(0, parseFloat((totais.valor_total - othersTotal).toFixed(2)));
      return {
        ...prev,
        pagamentos: currentPags.map(p => p.id === id ? { ...p, valor: rest } : p)
      };
    });
  };

  const totalPagamentosAlocado = useMemo(() => {
    if (!order.pagamento_dividido) return totais.valor_total;
    return (order.pagamentos || []).reduce((acc, p) => acc + (parseFloat(p.valor) || 0), 0);
  }, [order.pagamento_dividido, order.pagamentos, totais.valor_total]);

  const diferencaAlocacao = useMemo(() => {
    return parseFloat((totais.valor_total - totalPagamentosAlocado).toFixed(2));
  }, [totais.valor_total, totalPagamentosAlocado]);

  // Montar objeto de pedido completo para salvar / imprimir
  const buildCompleteOrder = (statusFinal = 'ORCAMENTO') => {
    if (!order.itens.length) {
      showToast('Adicione pelo menos 1 item antes de prosseguir.', 'warning');
      return null;
    }

    // Trava de segurança: impede salvar pedido com desconto acima do teto sem liberação do gerente
    if (totais.requer_autorizacao && !order.desconto_autorizado) {
      showToast(`O desconto concedido (${totais.desconto_percentual.toFixed(1)}%) ultrapassa o limite livre de ${config.desconto_maximo_livre || 5}% e exige a senha do gerente para liberação!`, 'warning');
      return null;
    }

    const orderCopy = JSON.parse(JSON.stringify(order));
    orderCopy.status = statusFinal;

    // Auto-salva ou atualiza os dados cadastrais do cliente no banco
    if (orderCopy.cliente && orderCopy.cliente.nome && orderCopy.cliente.nome.trim()) {
      const savedCliente = saveClient(orderCopy.cliente);
      if (savedCliente) {
        orderCopy.cliente = { ...orderCopy.cliente, ...savedCliente };
      }
    }

    orderCopy.resumo_fisico = {
      total_pecas: totais.total_pecas,
      volume_total_m3: totais.volume_total_m3,
      peso_total_kg: totais.peso_total_kg,
      veiculo_sugerido: totais.veiculo_sugerido
    };

    const isPago = statusFinal === 'PAGO' || statusFinal === 'APROVADO';

    // Atribuição e cálculo da comissão do Vendedor Responsável
    const vendedor = employees.find(e => e.id === orderCopy.vendedor_id) || defaultSeller;
    const comissaoPct = vendedor?.comissao_pct !== undefined ? vendedor.comissao_pct : 2.0;
    const valorComissao = parseFloat(((totais.valor_total * comissaoPct) / 100).toFixed(2));

    orderCopy.vendedor_id = vendedor ? vendedor.id : '';
    orderCopy.vendedor_nome = vendedor ? vendedor.nome : 'Vendedor de Balcão';
    orderCopy.comissao_vendedor_pct = comissaoPct;
    orderCopy.comissao_vendedor_valor = valorComissao;
    orderCopy.plaina_pct = order.plaina_pct || 0;
    orderCopy.plaina_base = order.plaina_base || 'ITENS_PLAINA';

    // Montagem da forma de pagamento e detalhe de parcelas/divisões
    let formaPagamentoFinal = order.forma_pagamento || 'Pix';
    let pagamentosDetalhe = [];

    if (order.pagamento_dividido && order.pagamentos && order.pagamentos.length > 0) {
      pagamentosDetalhe = order.pagamentos
        .filter(pg => (parseFloat(pg.valor) || 0) > 0)
        .map(pg => ({
          tipo: pg.tipo,
          valor: parseFloat(pg.valor) || 0,
          parcelas: pg.tipo === 'Cartão de Crédito' ? Math.min(5, Math.max(1, parseInt(pg.parcelas) || 1)) : 1
        }));

      if (pagamentosDetalhe.length > 0) {
        formaPagamentoFinal = pagamentosDetalhe
          .map(pg => {
            const parcStr = pg.tipo === 'Cartão de Crédito' && pg.parcelas > 1 ? ` (${pg.parcelas}x)` : '';
            return `${pg.tipo}${parcStr}: ${CalcEngine.formatBRL(pg.valor)}`;
          })
          .join(' + ');
      }
    } else {
      const parc = order.forma_pagamento === 'Cartão de Crédito' ? Math.min(5, Math.max(1, parseInt(order.cartao_parcelas) || 1)) : 1;
      const parcStr = order.forma_pagamento === 'Cartão de Crédito' && parc > 1 ? ` (${parc}x)` : '';
      formaPagamentoFinal = `${order.forma_pagamento}${parcStr}`;
      pagamentosDetalhe = [
        {
          tipo: order.forma_pagamento,
          valor: totais.valor_total,
          parcelas: parc
        }
      ];
    }

    orderCopy.forma_pagamento = formaPagamentoFinal;
    orderCopy.cartao_parcelas = order.cartao_parcelas || 1;
    orderCopy.pagamento_dividido = Boolean(order.pagamento_dividido);
    orderCopy.pagamentos = pagamentosDetalhe;

    orderCopy.resumo_financeiro = {
      subtotal_itens_puros: totais.subtotal_itens_puros,
      subtotal_itens_plaina: totais.subtotal_itens_plaina,
      taxa_aparelhamento: totais.taxa_aparelhamento,
      plaina_pct: order.plaina_pct || 0,
      plaina_base: order.plaina_base || 'ITENS_PLAINA',
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
      percentual_debito: totais.percentual_debito,
      valor_total_debito: totais.valor_total_debito,
      forma_pagamento: formaPagamentoFinal,
      pagamento_dividido: Boolean(order.pagamento_dividido),
      pagamentos_detalhe: pagamentosDetalhe,
      cartao_parcelas: order.cartao_parcelas || 1,
      valor_sinal: isPago ? totais.valor_total : 0,
      saldo_a_receber: 0,
      comissao_vendedor_pct: comissaoPct,
      comissao_vendedor_valor: valorComissao
    };

    if (isPago) {
      const temPlaina = orderCopy.itens.some(i => i.aparelhar);
      orderCopy.etapa_patio = temPlaina ? 'CORTE_PLAINA' : 'SEPARACAO';
      orderCopy.checklist_patio = orderCopy.itens.map(it => ({
        item_id: it.id,
        descricao: `${it.descricao} (${it.quantidade} pcs ${it.largura_cm ? it.largura_cm + 'cm x ' + (it.comprimento_m || 0) + 'm' : ''}) ${it.aparelhar ? '- APARELHAR' : ''}`.trim(),
        cortado: false,
        carregado: false,
        requer_plaina: it.aparelhar
      }));
    } else {
      orderCopy.etapa_patio = 'NAO_ENVIADO';
    }

    return orderCopy;
  };

  const handleSalvarPago = () => {
    if (order.pagamento_dividido && Math.abs(diferencaAlocacao) > 0.05) {
      if (diferencaAlocacao > 0) {
        showToast(`Atenção: Ainda falta distribuir ${CalcEngine.formatBRL(diferencaAlocacao)} nas formas de pagamento.`, 'warning');
      } else {
        showToast(`Atenção: O total distribuído ultrapassou o pedido em ${CalcEngine.formatBRL(Math.abs(diferencaAlocacao))}.`, 'warning');
      }
      return;
    }
    const pedido = buildCompleteOrder('PAGO');
    if (!pedido) return;
    saveOrder(pedido);
    showToast(`Venda #${pedido.numero} salva como PAGA com sucesso!`, 'success');
  };

  const handleSalvarOrcamento = () => {
    const pedido = buildCompleteOrder('ORCAMENTO');
    if (!pedido) return;
    saveOrder(pedido);
    showToast(`Orçamento #${pedido.numero} salvo com sucesso!`, 'success');
  };

  const handleImprimir = (modo = 'CLIENTE') => {
    const pedido = buildCompleteOrder(order.status || 'ORCAMENTO');
    if (!pedido) return;
    saveOrder(pedido);
    openPrintModal(pedido, modo);
  };

  const handleEnviarWhatsApp = () => {
    if (!order.itens || order.itens.length === 0) {
      showToast('Adicione pelo menos 1 item ao orçamento antes de enviar pelo WhatsApp.', 'warning');
      return;
    }

    const pedido = buildCompleteOrder(order.status || 'ORCAMENTO');
    if (!pedido) return; // Se bloqueado por trava de desconto, buildCompleteOrder retorna null

    // Salva o orçamento no sistema para garantir o número de registro
    saveOrder(pedido);

    let rawTel = (order.cliente?.telefone || '').replace(/\D/g, '');
    let phoneParam = '';
    if (rawTel.length >= 10) {
      phoneParam = rawTel.startsWith('55') && rawTel.length >= 12 ? rawTel : '55' + rawTel;
    }

    const texto = generateWhatsAppText 
      ? generateWhatsAppText(pedido, config?.percentual_preco_bruto || 20)
      : '';

    const url = phoneParam 
      ? `https://api.whatsapp.com/send?phone=${phoneParam}&text=${encodeURIComponent(texto)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank');

    if (phoneParam) {
      const nomeCliente = order.cliente?.nome ? ` para ${order.cliente.nome}` : '';
      showToast(`Abrindo WhatsApp${nomeCliente} (${order.cliente.telefone})...`, 'info');
    } else {
      showToast('Abrindo WhatsApp (selecione o contato). Dica: preencha o Telefone no campo do cliente para envio direto.', 'info');
    }
  };

  return (
    <div className="balcao-full-layout">
      {/* 1. PAINEL DE IDENTIFICAÇÃO DO CLIENTE & OBRA (LARGURA TOTAL) */}
      <div className="balcao-client-card" style={{ overflow: 'visible' }}>
        <div className="balcao-client-card-header">
          <div className="balcao-client-card-title">
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span>Identificação do Cliente, Obra e Vendedor</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setExpandirDadosEntrega(prev => !prev)}
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                padding: '3px 8px',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Mostrar ou ocultar campos de entrega e carpinteiro"
            >
              {expandirDadosEntrega ? '▲ Menos detalhes' : '▼ Local de Entrega & Parceiro'}
            </button>
            <span className="badge-tag badge-bruta font-mono" style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px' }}>
              ORÇAMENTO #{order.numero}
            </span>
          </div>
        </div>

        {/* LINHA 1: CLIENTE, TELEFONE, CPF/CNPJ, VENDEDOR */}
        <div className="balcao-client-row-1">
          <div className="form-group autocomplete-wrapper" ref={clientAutocompleteRef}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Nome do Cliente:</label>
              {order.cliente.id && (
                <span style={{ fontSize: '10.5px', color: 'var(--brand-primary)', fontWeight: 700 }}>
                  Cadastrado
                </span>
              )}
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="Pesquisar por nome, telefone ou CPF..."
              value={order.cliente.nome || ''}
              autoComplete="off"
              onChange={e => {
                const val = e.target.value;
                setOrder(prev => ({
                  ...prev,
                  cliente: {
                    ...prev.cliente,
                    nome: val,
                    id: prev.cliente.nome === val ? prev.cliente.id : ''
                  }
                }));
                setIsClientDropdownOpen(val.trim().length >= 1);
              }}
              onFocus={() => {
                if ((order.cliente.nome || '').trim().length >= 1) {
                  setIsClientDropdownOpen(true);
                }
              }}
            />
            {isClientDropdownOpen && (
              <div className="autocomplete-dropdown" style={{ zIndex: 1000 }}>
                {matchingClients.length > 0 ? (
                  matchingClients.map(c => (
                    <div
                      key={c.id}
                      className="autocomplete-item"
                      onClick={() => handleSelectClient(c)}
                    >
                      <div>
                        <div className="autocomplete-item-name">{c.nome}</div>
                        <div className="autocomplete-item-sub">
                          {c.telefone || 'Sem telefone'} | {c.bairro || 'Sem bairro'} {c.documento ? `| Doc: ${c.documento}` : ''}
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                        Selecionar
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="autocomplete-item" style={{ color: 'var(--text-muted)', cursor: 'default' }}>
                    <span>Nenhum cliente cadastrado com este nome. Os dados serão salvos automaticamente ao finalizar!</span>
                  </div>
                )}
              </div>
            )}
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
            <label className="form-label">Vendedor:</label>
            <select
              className="form-select"
              value={order.vendedor_id || ''}
              onChange={e => {
                const emp = employees?.find(item => item.id === e.target.value);
                setOrder(prev => ({
                  ...prev,
                  vendedor_id: e.target.value,
                  vendedor_nome: emp ? emp.nome : ''
                }));
              }}
            >
              {employees?.map(f => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LINHA 2: ENDEREÇO, BAIRRO, CIDADE, INSTRUÇÕES / CARPINTEIRO */}
        {expandirDadosEntrega && (
          <div className="balcao-client-row-2">
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Entrega / Parceiro:</label>
                {order.carpinteiro_id ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#F1F5F9', padding: '1px 6px', borderRadius: '4px', fontSize: '10.5px' }}>
                    <span>Parceiro: <strong>{order.carpinteiro_nome}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOrder(prev => ({ ...prev, carpinteiro_id: '', carpinteiro_nome: '' }))}
                      style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '0 2px', fontWeight: 800, fontSize: '11px', lineHeight: 1 }}
                      title="Remover carpinteiro"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  mostrarCarpinteiro ? (
                    <button
                      type="button"
                      onClick={() => setMostrarCarpinteiro(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '10.5px', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMostrarCarpinteiro(true)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '10.5px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      + Carpinteiro
                    </button>
                  )
                )}
              </div>

              {mostrarCarpinteiro && !order.carpinteiro_id && (
                <div style={{ marginBottom: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <select
                    className="form-select"
                    style={{ fontSize: '11.5px', height: '30px', flex: 1, borderColor: '#CBD5E1' }}
                    value={order.carpinteiro_id || ''}
                    onChange={e => {
                      const carp = carpenters.find(c => c.id === e.target.value);
                      setOrder(prev => ({
                        ...prev,
                        carpinteiro_id: e.target.value,
                        carpinteiro_nome: carp ? carp.nome : ''
                      }));
                      setMostrarCarpinteiro(false);
                    }}
                  >
                    <option value="">Selecione o Carpinteiro / Parceiro...</option>
                    {carpenters.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nome} {c.especialidade ? `(${c.especialidade})` : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => setMostrarCarpinteiro(false)}
                    style={{ height: '30px', padding: '0 8px', fontSize: '11px' }}
                  >
                    &times;
                  </button>
                </div>
              )}

              <input
                type="text"
                className="form-input"
                placeholder="Instruções para entrega e descarga..."
                value={order.observacoes || ''}
                onChange={e => setOrder(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. BARRA DE INSERÇÃO RÁPIDA (LARGURA TOTAL) */}
      <div className="balcao-insert-card">
        <div className="balcao-insert-grid">
          {/* Produto / Código (Combobox Inteligente) */}
          <div className="form-group product-combobox-container" id="fast-product-combobox-container" ref={productComboboxRef}>
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
                ref={fastProductSearchInputRef}
                className="form-input product-combobox-input"
                placeholder="Selecione ou digite para buscar produto..."
                autoComplete="off"
                spellCheck="false"
                value={fastProductSearch}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={e => {
                  const val = e.target.value;
                  setFastProductSearch(val);
                  if (selectedProduct && `${selectedProduct.codigo} - ${selectedProduct.nome}` !== val) {
                    setSelectedProduct(null);
                    setFastPreco('0.00');
                  }
                  setIsDropdownOpen(true);
                  setActiveProductIndex(0);
                }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setIsDropdownOpen(true);
                    setActiveProductIndex(prev => Math.min(prev + 1, produtosFiltrados.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setIsDropdownOpen(true);
                    setActiveProductIndex(prev => Math.max(prev - 1, 0));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (isDropdownOpen && produtosFiltrados.length > 0 && produtosFiltrados[activeProductIndex]) {
                      handleSelectFastProduct(produtosFiltrados[activeProductIndex]);
                    } else if (selectedProduct) {
                      focusInput(fastQtdInputRef);
                    } else if (fastProductSearch.trim()) {
                      handleAdicionarItemAvulso(fastProductSearch);
                    }
                  } else if (e.key === 'Escape') {
                    setIsDropdownOpen(false);
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

            {/* Dropdown Flutuante de Busca Inteligente com Realce de Letras e UX Alinhada */}
            {isDropdownOpen && (
              <div
                id="fast-produto-dropdown"
                className="product-combobox-dropdown"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  minWidth: 'min(580px, calc(100vw - 32px))',
                  maxWidth: '850px'
                }}
              >
                <div className="combobox-header">
                  <span id="fast-produto-status-text" className="combobox-status-text">
                    <span className="combobox-status-badge"></span>
                    <span id="fast-produto-status-count">
                      {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'item encontrado' : 'itens encontrados'}
                    </span>
                  </span>
                  <span className="combobox-kbd-hints">
                    <kbd>↑</kbd> <kbd>↓</kbd> navegar <kbd>↵ Enter</kbd> selecionar <kbd>Esc</kbd> fechar
                  </span>
                </div>
                <div id="fast-produto-results" className="combobox-results-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {produtosFiltrados.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Nenhum produto cadastrado para "{fastProductSearch}"
                      </div>
                      <div style={{ fontSize: '11px', marginBottom: '12px' }}>
                        Deseja adicionar este material como item avulso ao orçamento?
                      </div>
                      {fastProductSearch.trim() && (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => handleAdicionarItemAvulso(fastProductSearch)}
                          style={{ fontSize: '11.5px', padding: '6px 14px', fontWeight: 700 }}
                        >
                          + Adicionar "{fastProductSearch}" ao Orçamento
                        </button>
                      )}
                    </div>
                  ) : (
                    produtosFiltrados.map((p, idx) => {
                      const pCats = Array.isArray(p.categorias) && p.categorias.length > 0 ? p.categorias : (p.categoria ? [p.categoria] : []);
                      const isSelected = activeProductIndex === idx;
                      return (
                        <div
                          key={p.id}
                          className={`combobox-item ${isSelected ? 'active' : ''}`}
                          onClick={() => handleSelectFastProduct(p)}
                          onMouseEnter={() => setActiveProductIndex(idx)}
                          style={{
                            padding: '9px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #F1F5F9',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            textAlign: 'left'
                          }}
                        >
                          <div className="combobox-item-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div className="combobox-item-main" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                              <span className="combobox-item-code" style={{ padding: '2px 6px', borderRadius: '3px', fontWeight: 700, fontSize: '11px', flexShrink: 0 }}>
                                <HighlightText text={p.codigo} query={fastProductSearch} />
                              </span>
                              <span className="combobox-item-name" style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--text-primary)' }}>
                                <HighlightText text={p.nome} query={fastProductSearch} />
                              </span>
                              {pCats.length > 0 && (
                                <span className="category-chip" style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', flexShrink: 0 }}>
                                  <HighlightText text={pCats[0]} query={fastProductSearch} />
                                </span>
                              )}
                            </div>
                            <span className="combobox-item-price" style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '13px', color: '#047857', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                              {CalcEngine.formatBRL(p.preco_unitario)}
                              <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>/{p.tipo_calculo}</span>
                            </span>
                          </div>

                          {(p.especie || p.largura_cm > 0 || p.comprimento_padrao_m > 0 || p.tipo_calculo) && (
                            <div className="combobox-item-bottom" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                              {p.especie && <span>Madeira: <strong style={{ color: 'var(--text-secondary)' }}>{p.especie}</strong></span>}
                              {p.largura_cm > 0 && <span>Largura: <strong style={{ color: 'var(--text-secondary)' }}>{p.largura_cm}cm</strong></span>}
                              {p.comprimento_padrao_m > 0 && <span>Comprimento: <strong style={{ color: 'var(--text-secondary)' }}>{p.comprimento_padrao_m}m</strong></span>}
                              <span style={{ color: p.tipo_calculo === 'ML' ? '#047857' : (p.tipo_calculo === 'M2' ? '#2563EB' : 'var(--text-muted)'), fontWeight: 500 }}>
                                {p.tipo_calculo === 'ML' ? '• Metro Linear (ML)' : (p.tipo_calculo === 'M2' ? '• Metro Quadrado (M²)' : '• Peça Unitária')}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quantidade */}
          <div className="form-group">
            <label className="form-label" id="fast-qtd-label">Qtd:</label>
            <input
              type="number"
              id="fast-qtd-input"
              ref={fastQtdInputRef}
              className="form-input font-mono"
              min="1"
              step="1"
              value={fastQtd}
              onChange={e => setFastQtd(Math.max(1, parseInt(e.target.value) || 1))}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (isMadeiraLinear) {
                    focusInput(fastLarguraInputRef);
                  } else {
                    focusInput(fastAddBtnRef);
                  }
                }
              }}
            />
          </div>

          {/* Largura da Madeira (cm) */}
          <div className="form-group">
            <label className="form-label" id="fast-largura-label">
              <span>Largura (cm):</span>
            </label>
            <input
              type={isMadeiraLinear ? "number" : "text"}
              id="fast-largura-input"
              ref={fastLarguraInputRef}
              className="form-input font-mono"
              min="0.5"
              step="0.5"
              placeholder={isMadeiraLinear ? "Ex: 15" : "-"}
              value={isMadeiraLinear ? fastLargura : "-"}
              onChange={e => { if (isMadeiraLinear) setFastLargura(e.target.value); }}
              disabled={!isMadeiraLinear}
              style={!isMadeiraLinear ? { textAlign: 'center', backgroundColor: '#F8FAFC', color: 'var(--text-muted)', fontWeight: 700, cursor: 'not-allowed' } : {}}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  focusInput(fastCompInputRef);
                }
              }}
            />
          </div>

          {/* Comprimento */}
          <div className="form-group">
            <label className="form-label" id="fast-comp-label">
              <span>Comp. (m):</span>
            </label>
            <input
              type={isMadeiraLinear ? "number" : "text"}
              id="fast-comprimento-input"
              ref={fastCompInputRef}
              className="form-input font-mono"
              min="0.1"
              step="0.1"
              placeholder={isMadeiraLinear ? "Ex: 3.0" : "-"}
              value={isMadeiraLinear ? fastComprimento : "-"}
              onChange={e => { if (isMadeiraLinear) setFastComprimento(e.target.value); }}
              disabled={!isMadeiraLinear}
              style={!isMadeiraLinear ? { textAlign: 'center', backgroundColor: '#F8FAFC', color: 'var(--text-muted)', fontWeight: 700, cursor: 'not-allowed' } : {}}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  focusInput(fastAddBtnRef);
                }
              }}
            />
          </div>

          {/* Preço Unitário */}
          <div className="form-group">
            <label className="form-label">Preço (R$):</label>
            <input
              type="number"
              id="fast-preco-input"
              ref={fastPrecoInputRef}
              className="form-input font-mono"
              step="0.50"
              value={fastPreco}
              onChange={e => setFastPreco(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  focusInput(fastAddBtnRef);
                }
              }}
            />
          </div>

          {/* Subtotal Preview */}
          <div className="form-group">
            <label className="form-label">Subtotal:</label>
            <div
              id="fast-subtotal-preview"
              className="form-input font-mono"
              style={{ backgroundColor: 'var(--bg-surface-subtle)', fontWeight: 700, color: 'var(--brand-primary-text)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '34px' }}
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
              ref={fastAddBtnRef}
              style={{ width: '100%', height: '34px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onClick={handleAddItem}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Adicionar</span>
            </button>
          </div>
        </div>

        {/* FAIXA CONVERSACIONAL DE FEEDBACK E CONEXÃO ENTRE OS CAMPOS */}
        {selectedProduct ? (
          <div style={{
            marginTop: '10px',
            padding: '6px 12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontWeight: 700,
                backgroundColor: isMadeiraLinear ? '#ECFDF5' : '#EFF6FF',
                color: isMadeiraLinear ? '#047857' : '#1D4ED8',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {isMadeiraLinear ? '🌲 Madeira (ML)' : '📦 Item Unitário (UN)'}
              </span>
              <span>
                {isMadeiraLinear
                  ? `Cálculo por corte: ${fastLargura || '0'}cm largura × ${fastComprimento || '0'}m comprimento`
                  : 'Item por peça/unidade. Largura e comprimento não se aplicam (-).'}
              </span>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {fastQtd} {fastQtd === 1 ? 'peça' : 'peças'} × {CalcEngine.formatBRL(parseFloat(fastPreco) || 0)} = <span style={{ color: '#047857', fontSize: '12.5px' }}>{CalcEngine.formatBRL(fastSubtotalPreview)}</span>
            </div>
          </div>
        ) : (
          <div style={{
            marginTop: '8px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>💡 Dica: Peças unitárias (ferragens, abraçadeiras) deixam largura e comprimento como <strong>(-)</strong> automaticamente.</span>
            <span>Pressione <kbd style={{ padding: '1px 4px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '3px' }}>↵ Enter</kbd> para adicionar</span>
          </div>
        )}
      </div>

      {/* 3. GRADE DE ITENS DO ORÇAMENTO (LARGURA TOTAL) */}
      <div className="balcao-items-card">
        <div className="balcao-items-card-header">
          <span className="panel-title" style={{ fontSize: '13px', margin: 0 }}>
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
            Itens do Orçamento ({order.itens.length})
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Edição direta na grade: altere peças, bitola ou plaina e recalcule na hora
          </span>
        </div>

        <div className="balcao-items-card-body">
          <table className="dense-table">
            <thead>
              <tr>
                <th style={{ width: '32px' }} className="align-center">#</th>
                <th style={{ width: '70px' }}>Código</th>
                <th>Descrição do Produto / Bitola</th>
                <th style={{ width: '45px' }} className="align-center">Unid.</th>
                <th style={{ width: '60px' }} className="align-center">Qtd</th>
                <th style={{ width: '75px' }} className="align-center">Larg. (cm)</th>
                <th style={{ width: '75px' }} className="align-center">Comp. (m)</th>
                <th style={{ width: '65px' }} className="align-center">Plaina</th>
                <th style={{ width: '75px' }} className="align-right">Metragem</th>
                <th style={{ width: '85px' }} className="align-right">Unitário</th>
                <th style={{ width: '90px' }} className="align-right">Subtotal</th>
                <th style={{ width: '45px' }} className="align-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItens.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    Nenhum item adicionado ainda. Utilize a barra rápida acima para adicionar produtos.
                  </td>
                </tr>
              ) : (
                paginatedItens.map((it, idx) => {
                  const globalIdx = (safeItemsCurrentPage - 1) * itemsPageSize + idx + 1;
                  const prod = products.find(p => p.id === it.produto_id);
                  const estoqueAtual = prod ? parseFloat(prod.estoque_atual) || 0 : null;
                  return (
                    <tr key={it.id}>
                      <td className="align-center font-mono" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{globalIdx}</td>
                      <td className="font-mono" style={{ fontWeight: 600, color: 'var(--primary-green)' }}>{it.codigo}</td>
                      <td>
                        <strong>{it.descricao}</strong>
                        {it.aparelhar && (
                          <span className="badge-tag" style={{ marginLeft: '6px', fontSize: '9.5px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', padding: '1px 5px', fontWeight: 700, verticalAlign: 'middle' }}>
                            Plainar
                          </span>
                        )}
                        {estoqueAtual !== null && (
                          <div style={{ fontSize: '10.5px', marginTop: '2px' }}>
                            {estoqueAtual <= 0 ? (
                              <span style={{ color: '#DC2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <svg viewBox="0 0 24 24" width="11" height="11" stroke="#DC2626" fill="none" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                Zerado em estoque
                              </span>
                            ) : it.quantidade > estoqueAtual ? (
                              <span style={{ color: '#D97706', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <svg viewBox="0 0 24 24" width="11" height="11" stroke="#D97706" fill="none" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
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
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '13px' }}>-</span>
                        )}
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
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '13px' }}>-</span>
                        )}
                      </td>
                      <td className="align-center">
                        {(it.tipo_calculo === 'ML' || it.tipo_calculo === 'M2') ? (
                          <label style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', margin: 0 }}>
                            <input
                              type="checkbox"
                              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
                              checked={Boolean(it.aparelhar)}
                              onChange={e => handleUpdateItemInline(it.id, 'aparelhar', e.target.checked)}
                              title={it.aparelhar ? 'Marcado para aparelhar / plainar' : 'Marcar para aparelhar / plainar'}
                            />
                          </label>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>-</span>
                        )}
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
        {order.itens && order.itens.length > 0 && (
          <Pagination
            currentPage={itemsCurrentPage}
            totalItems={order.itens.length}
            pageSize={itemsPageSize}
            onPageChange={setItemsCurrentPage}
            onPageSizeChange={setItemsPageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            itemLabel="itens"
          />
        )}
      </div>

      {/* 4. PAINEL DE FECHAMENTO HORIZONTAL (4 BLOCOS BALANCEADOS LADO A LADO) */}
      <div className="balcao-footer-grid">
        {/* BLOCO 1: AJUSTES & ADICIONAIS */}
        <div className="balcao-footer-block">
          <div className="balcao-footer-block-title">
            <span>1. Ajustes & Adicionais</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Cálculo Base</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Subtotal dos Itens */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Subtotal dos Itens:</span>
              <span className="font-mono" style={{ fontWeight: 700, fontSize: '13px' }}>
                {CalcEngine.formatBRL(totais.subtotal_itens_puros)}
              </span>
            </div>

            {/* Plaina */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }} title={totais.qtd_itens_plaina === 0 ? 'Nenhum item marcado para plaina' : `${totais.qtd_itens_plaina} itens marcados para plainar`}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>(+) Plaina:</span>
                {totais.qtd_itens_plaina > 0 ? (
                  <span style={{ fontSize: '10px', color: '#047857', background: '#ECFDF5', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                    {totais.qtd_itens_plaina} {totais.qtd_itens_plaina === 1 ? 'item' : 'itens'}
                  </span>
                ) : (
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    (0)
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <div style={{ position: 'relative', width: '62px' }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    className="form-input font-mono"
                    style={{
                      height: '28px',
                      padding: '2px 16px 2px 6px',
                      textAlign: 'right',
                      fontSize: '11.5px',
                      backgroundColor: totais.qtd_itens_plaina === 0 ? '#F8FAFC' : 'inherit',
                      cursor: totais.qtd_itens_plaina === 0 ? 'not-allowed' : 'text',
                      color: totais.qtd_itens_plaina === 0 ? 'var(--text-muted)' : 'inherit',
                      border: (totais.qtd_itens_plaina > 0 && (!order.plaina_pct || order.plaina_pct === 0))
                        ? '1.5px solid #EF4444'
                        : undefined
                    }}
                    placeholder="0"
                    disabled={totais.qtd_itens_plaina === 0}
                    value={totais.qtd_itens_plaina === 0 ? '' : (order.plaina_pct === 0 ? '' : (order.plaina_pct ?? ''))}
                    onChange={e => {
                      const val = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                      setOrder(prev => ({ ...prev, plaina_pct: val }));
                    }}
                  />
                  <span style={{ position: 'absolute', right: '5px', top: '5px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, pointerEvents: 'none' }}>
                    %
                  </span>
                </div>
                <span className="font-mono" style={{ fontWeight: 700, minWidth: '65px', textAlign: 'right', fontSize: '12px', color: totais.taxa_aparelhamento > 0 ? '#047857' : 'var(--text-muted)' }}>
                  {CalcEngine.formatBRL(totais.taxa_aparelhamento)}
                </span>
              </div>
            </div>

            {/* Frete */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', gap: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>(+) Frete:</span>
              <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <select
                  className="form-select"
                  style={{ height: '28px', padding: '2px 6px', fontSize: '11px', flex: 1, minWidth: '90px', maxWidth: '160px' }}
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
                  <option value="">Selecione...</option>
                  {bairros.map(b => (
                    <option key={b.nome} value={b.nome}>{b.nome}</option>
                  ))}
                </select>
                <input
                  type="number"
                  className="form-input font-mono"
                  style={{ height: '28px', padding: '2px 6px', width: '70px', textAlign: 'right', fontSize: '11.5px', flexShrink: 0 }}
                  value={order.frete_valor}
                  onChange={e => setOrder(prev => ({ ...prev, frete_valor: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* Desconto */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', gap: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>(-) Desconto:</span>
              <div style={{ display: 'flex', gap: '4px', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <select
                  className="form-select"
                  style={{ height: '28px', padding: '2px 4px', fontSize: '11px', width: '48px', flexShrink: 0 }}
                  value={order.desconto_tipo}
                  onChange={e => setOrder(prev => ({ ...prev, desconto_tipo: e.target.value, desconto_autorizado: false }))}
                >
                  <option value="VALOR">R$</option>
                  <option value="PCT">%</option>
                </select>
                <input
                  type="number"
                  className="form-input font-mono"
                  style={{ height: '28px', padding: '2px 6px', width: '70px', textAlign: 'right', fontSize: '11.5px', flexShrink: 0 }}
                  value={order.desconto_valor}
                  onChange={e => setOrder(prev => ({ ...prev, desconto_valor: parseFloat(e.target.value) || 0, desconto_autorizado: false }))}
                />
              </div>
            </div>

            {/* Trava de Desconto com Senha do Gerente */}
            {totais.requer_autorizacao && !order.desconto_autorizado && (
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', padding: '6px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ color: '#92400E', fontWeight: 700, fontSize: '10.5px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span>🔒 Desconto &gt; {config.desconto_maximo_livre || 5}% exige liberação:</span>
                </div>
                {isAdmin ? (
                  <button 
                    type="button" 
                    className="btn btn-sm btn-primary" 
                    onClick={() => {
                      setOrder(prev => ({ ...prev, desconto_autorizado: true }));
                      showToast('Desconto liberado com perfil Administrador!', 'success');
                    }}
                    style={{ height: '26px', padding: '0 10px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    👑 Liberar como Admin
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <input
                      type="password"
                      className="form-input font-mono"
                      placeholder="Senha Gerente..."
                      style={{ height: '26px', flex: 1, fontSize: '11.5px' }}
                      value={senhaGerenteInput}
                      onChange={e => setSenhaGerenteInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAutorizarDesconto();
                        }
                      }}
                    />
                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAutorizarDesconto} style={{ height: '26px', padding: '0 8px', fontSize: '11px', fontWeight: 700 }}>
                      Liberar
                    </button>
                  </div>
                )}
              </div>
            )}
            {totais.requer_autorizacao && order.desconto_autorizado && (
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', padding: '3px 8px', borderRadius: '4px', fontSize: '10.5px', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>✓ Desconto Liberado pelo Gerente</span>
                <button
                  type="button"
                  onClick={() => setOrder(prev => ({ ...prev, desconto_autorizado: false }))}
                  style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                  title="Revogar liberação"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BLOCO 2: RESUMO DOS PREÇOS (À VISTA, DÉBITO, PRAZO) */}
        <div className="balcao-footer-block" style={{ background: '#FFFFFF' }}>
          <div className="balcao-footer-block-title">
            <span>2. Resumo de Preços</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Tabela Oficial</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center', flex: 1 }}>
            {/* Valor À Vista */}
            <div style={{ padding: '6px 10px', background: '#ECFDF5', border: '1.5px solid #10B981', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>VALOR À VISTA:</div>
                <div style={{ fontSize: '9.5px', color: '#065F46', fontWeight: 600 }}>PIX OU DINHEIRO</div>
              </div>
              <span className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#047857' }}>
                {CalcEngine.formatBRL(totais.valor_total)}
              </span>
            </div>

            {/* No Débito */}
            <div style={{ padding: '5px 10px', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>NO DÉBITO:</div>
                <div style={{ fontSize: '9px', color: '#B45309' }}>CARTÃO À VISTA</div>
              </div>
              <span className="font-mono" style={{ fontSize: '13.5px', fontWeight: 800, color: '#92400E' }}>
                {CalcEngine.formatBRL(totais.valor_total_debito)}
              </span>
            </div>

            {/* Preço Bruto / A Prazo */}
            <div style={{ padding: '5px 10px', background: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase' }}>A PRAZO (ATÉ 5X):</div>
                <div style={{ fontSize: '9px', color: '#2563EB' }}>CARTÃO CRÉDITO</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="font-mono" style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E40AF' }}>
                  {CalcEngine.formatBRL(totais.valor_total_bruto)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BLOCO 3: FORMA DE PAGAMENTO & COBRANÇA */}
        <div className="balcao-footer-block" style={{ background: '#FFFFFF' }}>
          <div className="balcao-footer-block-title">
            <span>3. Forma de Pagamento</span>
            <div style={{ display: 'inline-flex', background: '#F1F5F9', borderRadius: '4px', padding: '1px', border: '1px solid #CBD5E1' }}>
              <button
                type="button"
                onClick={() => handleTogglePagamentoDividido(false)}
                style={{
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontWeight: !order.pagamento_dividido ? 700 : 500,
                  background: !order.pagamento_dividido ? '#FFFFFF' : 'transparent',
                  color: !order.pagamento_dividido ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Única
              </button>
              <button
                type="button"
                onClick={() => handleTogglePagamentoDividido(true)}
                style={{
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontWeight: order.pagamento_dividido ? 700 : 500,
                  background: order.pagamento_dividido ? '#FFFFFF' : 'transparent',
                  color: order.pagamento_dividido ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Dividir
              </button>
            </div>
          </div>

          {!order.pagamento_dividido ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: order.forma_pagamento === 'Cartão de Crédito' ? '1fr 95px' : '1fr', gap: '6px' }}>
                <select
                  className="form-select"
                  style={{ height: '30px', fontWeight: 600, fontSize: '12px' }}
                  value={order.forma_pagamento}
                  onChange={e => {
                    const novaForma = e.target.value;
                    setOrder(prev => ({
                      ...prev,
                      forma_pagamento: novaForma,
                      cartao_parcelas: novaForma === 'Cartão de Crédito' ? (prev.cartao_parcelas || 1) : 1
                    }));
                  }}
                >
                  <option value="Pix">Pix (À Vista)</option>
                  <option value="Dinheiro">Dinheiro (À Vista)</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito (até 5x)</option>
                </select>

                {order.forma_pagamento === 'Cartão de Crédito' && (
                  <select
                    className="form-select font-mono"
                    style={{ height: '30px', fontWeight: 700, fontSize: '11.5px' }}
                    value={order.cartao_parcelas || 1}
                    onChange={e => setOrder(prev => ({ ...prev, cartao_parcelas: parseInt(e.target.value) || 1 }))}
                    title="Parcelas no Cartão (Máximo 5x)"
                  >
                    <option value={1}>1x (À vista)</option>
                    <option value={2}>2x</option>
                    <option value={3}>3x</option>
                    <option value={4}>4x</option>
                    <option value={5}>5x (Máx)</option>
                  </select>
                )}
              </div>

              {/* Caixa Informativa */}
              <div style={{ padding: '6px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11.5px' }}>
                <div style={{ color: 'var(--text-secondary)', marginBottom: '2px', fontSize: '9.5px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Cobrança no Balcão:
                </div>
                {order.forma_pagamento === 'Pix' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📱 Cobrar no <strong>Pix</strong>:</span>
                    <strong className="font-mono" style={{ fontSize: '13.5px', color: '#047857' }}>{CalcEngine.formatBRL(totais.valor_total)}</strong>
                  </div>
                )}
                {order.forma_pagamento === 'Dinheiro' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>💵 Receber em <strong>Dinheiro</strong>:</span>
                    <strong className="font-mono" style={{ fontSize: '13.5px', color: '#047857' }}>{CalcEngine.formatBRL(totais.valor_total)}</strong>
                  </div>
                )}
                {order.forma_pagamento === 'Cartão de Débito' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>💳 Cobrar no <strong>Débito</strong>:</span>
                    <strong className="font-mono" style={{ fontSize: '13.5px', color: '#92400E' }}>{CalcEngine.formatBRL(totais.valor_total_debito)}</strong>
                  </div>
                )}
                {order.forma_pagamento === 'Cartão de Crédito' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>💳 Crédito <strong>{order.cartao_parcelas || 1}x</strong>:</span>
                    <strong className="font-mono" style={{ fontSize: '13.5px', color: '#1E40AF' }}>
                      {CalcEngine.formatBRL(totais.valor_total_bruto)}
                      {(order.cartao_parcelas || 1) > 1 && (
                        <span style={{ fontSize: '10.5px', color: '#1E40AF', fontWeight: 600, marginLeft: '4px' }}>
                          ({order.cartao_parcelas}x {CalcEngine.formatBRL(totais.valor_total_bruto / order.cartao_parcelas)})
                        </span>
                      )}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ maxHeight: '115px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(order.pagamentos || []).map((pg, idx) => {
                  const isCred = pg.tipo === 'Cartão de Crédito';
                  const parc = isCred ? Math.min(5, Math.max(1, parseInt(pg.parcelas) || 1)) : 1;
                  return (
                    <div key={pg.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <select
                        className="form-select"
                        style={{ height: '28px', fontSize: '11.5px', flex: 1 }}
                        value={pg.tipo}
                        onChange={e => handleUpdatePaymentLine(pg.id, 'tipo', e.target.value)}
                      >
                        <option value="Pix">Pix</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Cartão de Débito">Cartão de Débito</option>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                      </select>

                      {isCred && (
                        <select
                          className="form-select font-mono"
                          style={{ height: '28px', fontSize: '11px', width: '65px' }}
                          value={parc}
                          onChange={e => handleUpdatePaymentLine(pg.id, 'parcelas', e.target.value)}
                        >
                          <option value={1}>1x</option>
                          <option value={2}>2x</option>
                          <option value={3}>3x</option>
                          <option value={4}>4x</option>
                          <option value={5}>5x</option>
                        </select>
                      )}

                      <input
                        type="number"
                        step="0.50"
                        min="0"
                        className="form-input font-mono"
                        style={{ height: '28px', width: '90px', padding: '2px 6px', textAlign: 'right', fontWeight: 700 }}
                        value={pg.valor === 0 ? '' : (pg.valor ?? '')}
                        placeholder="R$ 0,00"
                        onChange={e => handleUpdatePaymentLine(pg.id, 'valor', e.target.value)}
                      />

                      {(order.pagamentos || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePaymentLine(pg.id)}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '15px', padding: '0 3px' }}
                          title="Remover"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <button
                  type="button"
                  onClick={handleAddPaymentLine}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '10.5px', padding: '2px 8px', height: '24px' }}
                >
                  + Forma
                </button>

                <div>
                  {Math.abs(diferencaAlocacao) < 0.01 ? (
                    <span style={{ color: '#047857', fontWeight: 700 }}>✓ Total 100% OK</span>
                  ) : diferencaAlocacao > 0 ? (
                    <span style={{ color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>Falta: <strong>{CalcEngine.formatBRL(diferencaAlocacao)}</strong></span>
                      <button
                        type="button"
                        onClick={() => {
                          const lastId = order.pagamentos?.[order.pagamentos.length - 1]?.id;
                          if (lastId) handleAutofillRemaining(lastId);
                        }}
                        style={{ background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E', borderRadius: '3px', padding: '1px 5px', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Completar
                      </button>
                    </span>
                  ) : (
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>Ultrapassou: {CalcEngine.formatBRL(Math.abs(diferencaAlocacao))}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BLOCO 4: FINALIZAÇÃO DO PEDIDO & IMPRESSÕES */}
        <div className="balcao-footer-block" style={{ background: '#F8FAFC' }}>
          <div className="balcao-footer-block-title">
            <span>4. Finalização</span>
            <span style={{ fontSize: '10px', color: 'var(--brand-primary)', fontWeight: 700 }}>Pronto para Vender</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' }}>
            {/* Botão Primário: Salvar como Pago */}
            <button
              type="button"
              className="btn"
              onClick={handleSalvarPago}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '13.5px',
                border: 'none',
                borderRadius: '6px',
                height: '38px',
                width: '100%',
                boxShadow: '0 2px 4px rgba(5,150,105,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                cursor: 'pointer'
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2.8"><polyline points="20 6 9 17 4 12" /></svg>
              <span>Salvar como Pago</span>
            </button>

            {/* Linha com Salvar Orçamento e Enviar WhatsApp */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSalvarOrcamento}
                style={{ fontWeight: 600, fontSize: '11px', height: '32px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                title="Salvar apenas como orçamento pendente"
              >
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span>Salvar Orç.</span>
              </button>

              <button
                type="button"
                className="btn"
                onClick={handleEnviarWhatsApp}
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '11.5px',
                  border: 'none',
                  borderRadius: '4px',
                  height: '32px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(37,211,102,0.2)'
                }}
                title="Enviar Orçamento direto para o WhatsApp do cliente"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.067-1.137-.074-.75-.239-1.637-.775-2.502-1.64-.866-.865-1.401-1.752-1.64-2.502-.141-.443-.119-.825-.074-1.137.05-.333.419-1.026.824-1.17.133-.048.28-.023.38.077l.707 1.258c.08.143.064.321-.038.448l-.348.435c-.073.092-.09.219-.043.328.232.536.634 1.055 1.157 1.492.525.438 1.096.732 1.655.859.112.025.228-.014.298-.102l.418-.523c.106-.133.288-.179.441-.112l1.373.606c.148.065.234.22.204.378zM12 2C6.477 2 2 6.477 2 12c0 1.891.523 3.662 1.434 5.177L2 22l4.982-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Linha de Impressão */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleImprimir('CLIENTE')}
                style={{ fontWeight: 600, fontSize: '10.5px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                title="Imprimir via do cliente em formato A5"
              >
                <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                <span>Via A5</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleImprimir('PATIO')}
                style={{ fontWeight: 600, fontSize: '10.5px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                title="Imprimir romaneio de expedição para o pátio"
              >
                <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" fill="none" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
                <span>Romaneio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

