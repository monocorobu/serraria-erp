/**
 * SERRARIA & MADEIREIRA BOM JESUS - MOTOR MATEMÁTICO DA SERRARIA
 * Regras reais de cubagem, peso, plaina, preço à vista e preço bruto (+20% ou configurado).
 */
import { DB } from './data.js';

export const CalcEngine = {
  DEFAULT_TAXA_PLAINA_ML: 3.50,
  DEFAULT_TAXA_PLAINA_M2: 8.00,
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

  getPercentualPrecoBruto() {
    if (typeof DB !== 'undefined' && DB.getConfig) {
      const cfg = DB.getConfig();
      if (cfg && cfg.percentual_preco_bruto !== undefined) {
        const val = parseFloat(cfg.percentual_preco_bruto);
        return isNaN(val) ? 20.0 : val;
      }
    }
    return 20.0;
  },

  setPercentualPrecoBruto(pct) {
    if (typeof DB !== 'undefined' && DB.getConfig) {
      const cfg = DB.getConfig();
      cfg.percentual_preco_bruto = parseFloat(pct) || 20.0;
      DB.salvarConfig(cfg);
    }
  },

  calcularPrecoBruto(valorAVista, percentual = null) {
    const pct = percentual !== null ? parseFloat(percentual) : this.getPercentualPrecoBruto();
    const valor = parseFloat(valorAVista) || 0;
    const finalPct = isNaN(pct) ? 20.0 : pct;
    return parseFloat((valor * (1 + finalPct / 100)).toFixed(2));
  },

  getPercentualTaxaDebito() {
    if (typeof DB !== 'undefined' && DB.getConfig) {
      const cfg = DB.getConfig();
      if (cfg && cfg.percentual_taxa_debito !== undefined) {
        const val = parseFloat(cfg.percentual_taxa_debito);
        return isNaN(val) ? 2.5 : val;
      }
    }
    return 2.5;
  },

  calcularPrecoDebito(valorAVista, percentual = null) {
    const pct = percentual !== null ? parseFloat(percentual) : this.getPercentualTaxaDebito();
    const valor = parseFloat(valorAVista) || 0;
    const finalPct = isNaN(pct) ? 2.5 : pct;
    return parseFloat((valor * (1 + finalPct / 100)).toFixed(2));
  },

  calcularItem(item, produto) {
    const tipo = (produto && produto.tipo_calculo) || item.tipo_calculo || 'ML';
    const qtd = Math.max(0, parseFloat(item.quantidade) || 0);
    const comp = Math.max(0, parseFloat(item.comprimento_m) || 0);
    const precoUnit = parseFloat(item.valor_unitario !== undefined ? item.valor_unitario : produto?.preco_unitario) || 0;
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

    if (tipo === 'ML') {
      metragemTotal = qtd * comp;
      subtotalPuro = metragemTotal * precoUnit;
      // Taxa de plaina não é mais automática por item, é calculada via % no fechamento
      taxaPlaina = 0;
      if (larguraCm > 0 && espessuraCm > 0) {
        volumeM3 = (espessuraCm / 100) * (larguraCm / 100) * comp * qtd;
        pesoKg = volumeM3 * densidade;
      } else {
        pesoKg = metragemTotal * 3.2;
      }
    } else if (tipo === 'M2') {
      metragemTotal = qtd;
      subtotalPuro = metragemTotal * precoUnit;
      taxaPlaina = 0;
      const espM = (espessuraCm > 0 ? espessuraCm : 2.0) / 100;
      volumeM3 = metragemTotal * espM;
      pesoKg = volumeM3 * densidade;
    } else if (tipo === 'M3') {
      metragemTotal = qtd;
      subtotalPuro = metragemTotal * precoUnit;
      volumeM3 = metragemTotal;
      pesoKg = volumeM3 * densidade;
    } else {
      metragemTotal = qtd;
      subtotalPuro = metragemTotal * precoUnit;
      const pesoUnit = (produto && parseFloat(produto.peso_unitario_kg)) || 2.5;
      pesoKg = qtd * pesoUnit;
    }

    const subtotalFinal = subtotalPuro;

    return {
      tipo_calculo: tipo,
      metragem_total: parseFloat(metragemTotal.toFixed(2)),
      subtotal_puro: parseFloat(subtotalPuro.toFixed(2)),
      taxa_plaina: 0,
      subtotal: parseFloat(subtotalFinal.toFixed(2)),
      volume_m3: parseFloat(volumeM3.toFixed(3)),
      peso_kg: parseFloat(pesoKg.toFixed(1)),
      espessura_cm: espessuraCm,
      largura_cm: larguraCm,
      aparelhar: querAparelhar
    };
  },

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

  calcularTotaisOrcamento(
    itens = [], 
    freteValor = 0, 
    descontoValorOuPct = 0, 
    tipoDesconto = 'VALOR', 
    sinalPago = 0,
    plainaPct = 0,
    plainaBase = 'ITENS_PLAINA'
  ) {
    let subtotalItensPuros = 0;
    let subtotalItensPlaina = 0;
    let qtdItensPlaina = 0;
    let totalPecas = 0;
    let totalVolumeM3 = 0;
    let totalPesoKg = 0;

    itens.forEach(item => {
      totalPecas += (parseFloat(item.quantidade) || 0);
      const sub = parseFloat(item.subtotal_puro !== undefined ? item.subtotal_puro : item.subtotal) || 0;
      subtotalItensPuros += sub;
      if (item.aparelhar) {
        subtotalItensPlaina += sub;
        qtdItensPlaina += 1;
      }
      totalVolumeM3 += (parseFloat(item.volume_m3) || 0);
      totalPesoKg += (parseFloat(item.peso_kg) || 0);
    });

    const pctPlaina = Math.max(0, parseFloat(plainaPct) || 0);
    
    // A taxa de plaina SOMENTE é adicionada se houver pelo menos 1 caixa de plaina marcada!
    // Do contrário, não tem plaina (valor é estritamente 0).
    let totalTaxaPlaina = 0;
    let basePlaina = 0;

    if (qtdItensPlaina > 0 && pctPlaina > 0) {
      basePlaina = subtotalItensPlaina;
      totalTaxaPlaina = (basePlaina * pctPlaina) / 100;
    }

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

    const requerAutorizacao = descontoPct > (this.getDescontoMaximoLivre() + 0.01);
    const valorTotal = Math.max(0, baseCalculo - descontoReal);
    const sinal = Math.max(0, parseFloat(sinalPago) || 0);
    const saldoReceber = Math.max(0, valorTotal - sinal);
    const veiculo = this.identificarVeiculo(totalPesoKg, totalVolumeM3);

    const percentualBruto = this.getPercentualPrecoBruto();
    const valorTotalBruto = this.calcularPrecoBruto(valorTotal, percentualBruto);

    const percentualDebito = this.getPercentualTaxaDebito();
    const valorTotalDebito = this.calcularPrecoDebito(valorTotal, percentualDebito);

    return {
      subtotal_itens_puros: parseFloat(subtotalItensPuros.toFixed(2)),
      subtotal_itens_plaina: parseFloat(subtotalItensPlaina.toFixed(2)),
      qtd_itens_plaina: qtdItensPlaina,
      base_plaina: parseFloat(basePlaina.toFixed(2)),
      plaina_percentual: pctPlaina,
      taxa_aparelhamento: parseFloat(totalTaxaPlaina.toFixed(2)),
      subtotal_com_plaina: parseFloat(subtotalBruto.toFixed(2)),
      valor_frete: parseFloat(frete.toFixed(2)),
      desconto_valor: parseFloat(descontoReal.toFixed(2)),
      desconto_percentual: parseFloat(descontoPct.toFixed(2)),
      requer_autorizacao: requerAutorizacao,
      valor_total: parseFloat(valorTotal.toFixed(2)),
      percentual_bruto: percentualBruto,
      valor_total_bruto: parseFloat(valorTotalBruto.toFixed(2)),
      percentual_debito: percentualDebito,
      valor_total_debito: parseFloat(valorTotalDebito.toFixed(2)),
      valor_sinal: parseFloat(sinal.toFixed(2)),
      saldo_a_receber: parseFloat(saldoReceber.toFixed(2)),
      total_pecas: Math.round(totalPecas),
      volume_total_m3: parseFloat(totalVolumeM3.toFixed(3)),
      peso_total_kg: parseFloat(totalPesoKg.toFixed(1)),
      veiculo_sugerido: veiculo.tipo + ' - ' + veiculo.detalhe,
      veiculo_classe: veiculo.classe
    };
  },

  calcularKitTelhado(areaM2, especie = 'Garapeira') {
    const area = Math.max(1, parseFloat(areaM2) || 0);
    const metrosViga = area * 0.35;
    const qtdVigas = Math.max(2, Math.ceil(metrosViga / 4.5));
    const metrosCaibro = area * 1.9;
    const qtdCaibros = Math.max(4, Math.ceil(metrosCaibro / 4.0));
    const metrosRipa = area * 2.8;
    const qtdRipas = Math.max(6, Math.ceil(metrosRipa / 3.0));
    const qtdTelhas = Math.ceil(area * 16 * 1.05);
    const kgPregoCaibro = Math.max(1, Math.ceil(area * 0.06));

    return {
      area_m2: area,
      especie: especie,
      itens_sugeridos: [
        { codigo: 'MAD-001', nome: `Viga ${especie} 6x12`, quantidade: qtdVigas, comprimento_m: 4.5, tipo_calculo: 'ML', aparelhar: false },
        { codigo: 'MAD-005', nome: 'Caibro Peroba 5x6', quantidade: qtdCaibros, comprimento_m: 4.0, tipo_calculo: 'ML', aparelhar: false },
        { codigo: 'MAD-007', nome: 'Ripa Peroba 1.5x5', quantidade: qtdRipas, comprimento_m: 3.0, tipo_calculo: 'ML', aparelhar: false },
        { codigo: 'TEL-001', nome: 'Telha Romana Cerâmica Esmaltada', quantidade: qtdTelhas, comprimento_m: 0, tipo_calculo: 'UN', aparelhar: false },
        { codigo: 'FER-002', nome: 'Prego 19x36 para Caibro (Kg)', quantidade: kgPregoCaibro, comprimento_m: 0, tipo_calculo: 'UN', aparelhar: false }
      ]
    };
  },

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

if (typeof window !== 'undefined') {
  window.CalcEngine = CalcEngine;
}
