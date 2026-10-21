/**
 * SERRARIA & MADEIREIRA ERP - MOTOR MATEMÁTICO DA SERRARIA
 * Regras reais de cubagem, peso, plaina e cálculo por ML, M2, M3 e UN.
 */

const CalcEngine = {
  // Configuração global da serraria
  DEFAULT_TAXA_PLAINA_ML: 3.50, // R$ 3,50 por metro linear
  DEFAULT_TAXA_PLAINA_M2: 8.00, // R$ 8,00 por metro quadrado
  SENHA_GERENTE_DESCONTO: '1234',

  getSenhaGerente() {
    if (typeof DB !== 'undefined' && DB.getConfig) {
      return DB.getConfig().senha_gerente || this.SENHA_GERENTE_DESCONTO;
    }
    return this.SENHA_GERENTE_DESCONTO;
  },

  getDescontoMaximoLivre() {
    if (typeof DB !== 'undefined' && DB.getConfig) {
      return parseFloat(DB.getConfig().desconto_maximo_livre) || 5.0;
    }
    return 5.0;
  },

  /**
   * Calcula uma linha de produto do orçamento
   * @param {Object} item - Dados do item (produto, quantidade, comprimento, aparelhar, etc.)
   * @param {Object} produto - Cadastro do produto
   */
  calcularItem(item, produto) {
    const tipo = (produto && produto.tipo_calculo) || item.tipo_calculo || 'ML';
    const qtd = Math.max(0, parseFloat(item.quantidade) || 0);
    const comp = Math.max(0, parseFloat(item.comprimento_m) || 0);
    const precoUnit = parseFloat(item.valor_unitario !== undefined ? item.valor_unitario : produto.preco_unitario) || 0;
    const querAparelhar = Boolean(item.aparelhar);

    let metragemTotal = 0;
    let subtotalPuro = 0;
    let taxaPlaina = 0;
    let volumeM3 = 0;
    let pesoKg = 0;

    let espessuraCm = produto ? (parseFloat(produto.espessura_cm) || 0) : 0;
    let larguraCm = (item.largura_cm !== undefined && item.largura_cm !== null && item.largura_cm !== '') 
      ? (parseFloat(item.largura_cm) || 0) 
      : (produto ? (parseFloat(produto.largura_cm) || 0) : 0);

    // Heurística de extração de dimensões (largura e espessura em cm) caso não informadas
    if (larguraCm === 0 && (produto?.nome || item.descricao)) {
      const nomeRef = produto?.nome || item.descricao || '';
      const matchX = nomeRef.match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*[xX]\s*(\d+(?:[.,]\d+)?)(?:\s*(?:cm|CM|mm|MM))?/);
      if (matchX) {
        if (espessuraCm === 0) espessuraCm = parseFloat(matchX[1].replace(',', '.')) || 0;
        larguraCm = parseFloat(matchX[2].replace(',', '.')) || 0;
        if (/mm/i.test(matchX[0])) {
          espessuraCm = espessuraCm / 10;
          larguraCm = larguraCm / 10;
        }
      } else {
        const matchCm = nomeRef.match(/(?:^|\s)(\d+(?:[.,]\d+)?)\s*(?:cm|CM)\b/);
        if (matchCm) {
          larguraCm = parseFloat(matchCm[1].replace(',', '.')) || 0;
        }
      }
    }

    if (espessuraCm === 0 && (tipo === 'ML' || tipo === 'M3')) {
      const nomeRef = produto?.nome || item.descricao || '';
      espessuraCm = /VIGA|PRANCHA|CAIBRO/i.test(nomeRef) ? 5.0 : 2.5;
    }

    const densidade = produto ? (parseFloat(produto.densidade_kg_m3) || 750) : 750;

    switch (tipo) {
      case 'ML': {
        // Metro Linear: Total ML = Peças * Comprimento
        metragemTotal = qtd * comp;
        subtotalPuro = metragemTotal * precoUnit;
        
        if (querAparelhar) {
          const taxaPorMl = produto && produto.taxa_plaina_padrao !== undefined 
            ? parseFloat(produto.taxa_plaina_padrao) 
            : this.DEFAULT_TAXA_PLAINA_ML;
          taxaPlaina = metragemTotal * taxaPorMl;
        }

        // Cubagem: V = Qtd * (Espessura/100) * (Largura/100) * Comprimento
        if (larguraCm > 0 && comp > 0) {
          const esp = espessuraCm > 0 ? espessuraCm : 2.5;
          volumeM3 = qtd * (esp / 100) * (larguraCm / 100) * comp;
          pesoKg = volumeM3 * densidade;
        }
        break;
      }

      case 'M2': {
        // Metro Quadrado: Área fornecida diretamente em qtd
        metragemTotal = qtd;
        subtotalPuro = metragemTotal * precoUnit;

        if (querAparelhar) {
          const taxaPorM2 = produto && produto.taxa_plaina_padrao !== undefined 
            ? parseFloat(produto.taxa_plaina_padrao) 
            : this.DEFAULT_TAXA_PLAINA_M2;
          taxaPlaina = metragemTotal * taxaPorM2;
        }

        if (espessuraCm > 0) {
          volumeM3 = metragemTotal * (espessuraCm / 100);
          pesoKg = volumeM3 * densidade;
        } else {
          volumeM3 = metragemTotal * 0.015;
          pesoKg = volumeM3 * densidade;
        }
        break;
      }

      case 'M3': {
        // Metro Cúbico
        if (espessuraCm > 0 && larguraCm > 0 && comp > 0) {
          volumeM3 = qtd * (espessuraCm / 100) * (larguraCm / 100) * comp;
        } else {
          volumeM3 = qtd; // já informado em m³
        }
        metragemTotal = volumeM3;
        subtotalPuro = volumeM3 * precoUnit;
        pesoKg = volumeM3 * densidade;
        break;
      }

      case 'UN':
      default: {
        // Unidade / Peça (Telhas, Ferragens, Tábuas de tamanho fixo)
        metragemTotal = qtd;
        subtotalPuro = qtd * precoUnit;

        if (querAparelhar && produto && produto.taxa_plaina_padrao) {
          taxaPlaina = qtd * parseFloat(produto.taxa_plaina_padrao);
        }

        if (produto && produto.peso_unitario_kg) {
          pesoKg = qtd * parseFloat(produto.peso_unitario_kg);
          volumeM3 = qtd * (parseFloat(produto.volume_unitario_m3) || 0.001);
        } else if (produto && produto.comprimento_padrao_m && espessuraCm > 0 && larguraCm > 0) {
          const vol1 = (espessuraCm / 100) * (larguraCm / 100) * produto.comprimento_padrao_m;
          volumeM3 = qtd * vol1;
          pesoKg = volumeM3 * densidade;
        } else {
          pesoKg = qtd * 2.0; // estimativa padrão
          volumeM3 = qtd * 0.002;
        }
        break;
      }
    }

    const subtotal = subtotalPuro + taxaPlaina;

    return {
      metragem_total: parseFloat(metragemTotal.toFixed(2)),
      subtotal_puro: parseFloat(subtotalPuro.toFixed(2)),
      taxa_plaina: parseFloat(taxaPlaina.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      volume_m3: parseFloat(volumeM3.toFixed(4)),
      peso_kg: parseFloat(pesoKg.toFixed(1))
    };
  },

  /**
   * Determina o tipo de veículo adequado com base no peso e volume
   */
  identificarVeiculo(pesoKg, volumeM3 = 0) {
    if (pesoKg <= 1200 && volumeM3 <= 3.5) {
      return {
        tipo: 'Picape / Caminhonete',
        detalhe: 'Fiorino / Saveiro / Strada / Hilux (até 1.200 kg)',
        classe: 'veiculo-leve'
      };
    } else if (pesoKg <= 4000 && volumeM3 <= 10.0) {
      return {
        tipo: 'Caminhão 3/4',
        detalhe: 'VW Delivery / MB Accelo (até 4.000 kg)',
        classe: 'veiculo-medio'
      };
    } else if (pesoKg <= 8500) {
      return {
        tipo: 'Caminhão Toco Médio',
        detalhe: 'MB 1620 / Atego / Cargo (até 8.500 kg)',
        classe: 'veiculo-pesado'
      };
    } else {
      return {
        tipo: 'Caminhão Truck Pesado',
        detalhe: 'VW Constellation / 24.280 (até 14.000 kg)',
        classe: 'veiculo-truck'
      };
    }
  },

  /**
   * Calcula os totais do orçamento
   */
  calcularTotaisOrcamento(itens, freteValor = 0, descontoValorOuPct = 0, tipoDesconto = 'VALOR', sinalPago = 0) {
    let subtotalItensPuros = 0;
    let totalTaxaPlaina = 0;
    let totalPecas = 0;
    let totalVolumeM3 = 0;
    let totalPesoKg = 0;

    itens.forEach(item => {
      totalPecas += (parseFloat(item.quantidade) || 0);
      subtotalItensPuros += (parseFloat(item.subtotal_puro) !== undefined ? parseFloat(item.subtotal_puro) : (item.subtotal - (item.taxa_plaina || 0)));
      totalTaxaPlaina += (parseFloat(item.taxa_plaina) || 0);
      totalVolumeM3 += (parseFloat(item.volume_m3) || 0);
      totalPesoKg += (parseFloat(item.peso_kg) || 0);
    });

    const subtotalBruto = subtotalItensPuros + totalTaxaPlaina;
    const frete = Math.max(0, parseFloat(freteValor) || 0);
    const baseCalculo = subtotalBruto + frete;

    let descontoReal = 0;
    let descontoPct = 0;

    if (tipoDesconto === 'PCT') {
      descontoPct = Math.max(0, parseFloat(descontoValorOuPct) || 0);
      descontoReal = (baseCalculo * descontoPct) / 100;
    } else {
      descontoReal = Math.max(0, parseFloat(descontoValorOuPct) || 0);
      descontoPct = baseCalculo > 0 ? (descontoReal / baseCalculo) * 100 : 0;
    }

    // Trava de segurança se desconto > teto livre configurado pelo gerente
    const requerAutorizacao = descontoPct > (this.getDescontoMaximoLivre() + 0.01);

    const valorTotal = Math.max(0, baseCalculo - descontoReal);
    const sinal = Math.max(0, parseFloat(sinalPago) || 0);
    const saldoReceber = Math.max(0, valorTotal - sinal);
    const veiculo = this.identificarVeiculo(totalPesoKg, totalVolumeM3);

    return {
      subtotal_itens_puros: parseFloat(subtotalItensPuros.toFixed(2)),
      taxa_aparelhamento: parseFloat(totalTaxaPlaina.toFixed(2)),
      subtotal_com_plaina: parseFloat(subtotalBruto.toFixed(2)),
      valor_frete: parseFloat(frete.toFixed(2)),
      desconto_valor: parseFloat(descontoReal.toFixed(2)),
      desconto_percentual: parseFloat(descontoPct.toFixed(2)),
      requer_autorizacao: requerAutorizacao,
      valor_total: parseFloat(valorTotal.toFixed(2)),
      valor_sinal: parseFloat(sinal.toFixed(2)),
      saldo_a_receber: parseFloat(saldoReceber.toFixed(2)),
      total_pecas: Math.round(totalPecas),
      volume_total_m3: parseFloat(totalVolumeM3.toFixed(3)),
      peso_total_kg: parseFloat(totalPesoKg.toFixed(1)),
      veiculo_sugerido: veiculo.tipo + ' - ' + veiculo.detalhe,
      veiculo_classe: veiculo.classe
    };
  },

  /**
   * Calculadora Expressa de Telhado
   * Calcula lista sugerida de Vigas, Caibros, Ripas e Telhas para uma determinada área em m²
   */
  calcularKitTelhado(areaM2, especie = 'Garapeira') {
    const area = Math.max(1, parseFloat(areaM2) || 0);

    // Heurísticas reais de marcenaria/madeireira brasileira:
    // Vigas 6x12: ~ 0.35 metro linear por m² (em peças de 4.5m ou 5.0m)
    const metrosViga = area * 0.35;
    const qtdVigas = Math.max(2, Math.ceil(metrosViga / 4.5));
    
    // Caibros 5x6: ~ 1.9 metros lineares por m² (em peças de 4.0m)
    const metrosCaibro = area * 1.9;
    const qtdCaibros = Math.max(4, Math.ceil(metrosCaibro / 4.0));

    // Ripas 1.5x5: ~ 2.8 metros lineares por m² (em peças de 3.0m)
    const metrosRipa = area * 2.8;
    const qtdRipas = Math.max(6, Math.ceil(metrosRipa / 3.0));

    // Telha Romana: ~ 16 telhas por m² + 5% quebra
    const qtdTelhas = Math.ceil(area * 16 * 1.05);

    // Pregos para caibro (19x36): ~ 0.06 kg/m²
    const kgPregoCaibro = Math.max(1, Math.ceil(area * 0.06));

    return {
      area_m2: area,
      especie: especie,
      itens_sugeridos: [
        {
          codigo: 'MAD-001',
          nome: `Viga ${especie} 6x12`,
          quantidade: qtdVigas,
          comprimento_m: 4.5,
          tipo_calculo: 'ML',
          aparelhar: false
        },
        {
          codigo: 'MAD-005',
          nome: 'Caibro Peroba 5x6',
          quantidade: qtdCaibros,
          comprimento_m: 4.0,
          tipo_calculo: 'ML',
          aparelhar: false
        },
        {
          codigo: 'MAD-007',
          nome: 'Ripa Peroba 1.5x5',
          quantidade: qtdRipas,
          comprimento_m: 3.0,
          tipo_calculo: 'ML',
          aparelhar: false
        },
        {
          codigo: 'TEL-001',
          nome: 'Telha Romana Cerâmica Esmaltada',
          quantidade: qtdTelhas,
          comprimento_m: 0,
          tipo_calculo: 'UN',
          aparelhar: false
        },
        {
          codigo: 'FER-002',
          nome: 'Prego 19x36 para Caibro (Kg)',
          quantidade: kgPregoCaibro,
          comprimento_m: 0,
          tipo_calculo: 'UN',
          aparelhar: false
        }
      ]
    };
  },

  // Formatadores de exibição rigorosos (tabular-nums)
  formatBRL(valor) {
    const num = parseFloat(valor) || 0;
    return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  formatBRLSemSimbolo(valor) {
    const num = parseFloat(valor) || 0;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  formatNumero(valor, decimais = 2) {
    const num = parseFloat(valor) || 0;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: decimais, maximumFractionDigits: decimais });
  },

  formatM3(valor) {
    const num = parseFloat(valor) || 0;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' m³';
  },

  formatKg(valor) {
    const num = parseFloat(valor) || 0;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' kg';
  }
};

window.CalcEngine = CalcEngine;

