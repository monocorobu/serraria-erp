import { useState, useCallback } from 'react';
import { DB } from '../services/data.js';
import { CalcEngine } from '../services/calc.js';
import { ApiClient } from '../services/api.js';

/**
 * Custom Hook: usePrecoBruto
 * Gerenciamento das regras comerciais de Preço À Vista e Preço Bruto a Prazo
 */
export function usePrecoBruto(showToast) {
  const [config, setConfig] = useState(() => DB.getConfig());
  const percentual = config.percentual_preco_bruto !== undefined ? config.percentual_preco_bruto : 20.0;

  // Atualizar percentual configurado pelo Gerente
  const updatePercentual = useCallback((novoPct) => {
    const val = parseFloat(novoPct);
    if (isNaN(val) || val < 0) {
      if (showToast) showToast('Informe uma porcentagem válida para o Preço Bruto.', 'error');
      return false;
    }

    const updatedConfig = { ...config, percentual_preco_bruto: val };
    DB.salvarConfig(updatedConfig);
    if (CalcEngine && typeof CalcEngine.setPercentualPrecoBruto === 'function') {
      CalcEngine.setPercentualPrecoBruto(val);
    }
    setConfig(updatedConfig);

    // Sincroniza com rota de API do banco
    ApiClient.saveConfig(updatedConfig).catch(() => {});

    if (showToast) showToast(`Percentual do Preço Bruto atualizado para ${val.toFixed(1)}%!`, 'success');
    return true;
  }, [config, showToast]);

  // Cálculos dinâmicos
  const calcularBruto = useCallback((valorAVista, pctCustom = null) => {
    const pct = pctCustom !== null ? pctCustom : percentual;
    return CalcEngine.calcularPrecoBruto(valorAVista, pct);
  }, [percentual]);

  const simularParcelamento = useCallback((valorBruto, maxParcelas = 12) => {
    const total = parseFloat(valorBruto) || 0;
    const parcelas = [];
    for (let i = 1; i <= maxParcelas; i++) {
      parcelas.push({
        vezes: i,
        valorParcela: total / i,
        texto: `${i}x de ${CalcEngine.formatBRL(total / i)} sem juros no cartão`
      });
    }
    return parcelas;
  }, []);

  // Salvar configurações gerais da madeireira (senha do gerente, travas, taxas, dados da empresa)
  const updateConfig = useCallback((novaConfig) => {
    if (typeof novaConfig === 'number' || (typeof novaConfig === 'string' && !isNaN(Number(novaConfig)))) {
      return updatePercentual(novaConfig);
    }

    if (!novaConfig || typeof novaConfig !== 'object') {
      return false;
    }

    const updated = {
      ...config,
      ...novaConfig
    };

    if (updated.percentual_preco_bruto !== undefined) {
      const pct = parseFloat(updated.percentual_preco_bruto) || 20.0;
      updated.percentual_preco_bruto = pct;
      if (CalcEngine && typeof CalcEngine.setPercentualPrecoBruto === 'function') {
        CalcEngine.setPercentualPrecoBruto(pct);
      }
    }
    if (updated.desconto_maximo_livre !== undefined) {
      updated.desconto_maximo_livre = parseFloat(updated.desconto_maximo_livre) || 5.0;
    }
    if (updated.percentual_taxa_debito !== undefined) {
      updated.percentual_taxa_debito = parseFloat(updated.percentual_taxa_debito) || 2.5;
    }

    DB.salvarConfig(updated);
    setConfig(updated);

    ApiClient.saveConfig(updated).catch(() => {});

    if (showToast) {
      showToast('Configurações e senha do gerente salvas com sucesso!', 'success');
    }
    return true;
  }, [config, updatePercentual, showToast]);

  return {
    config,
    setConfig,
    percentual,
    updatePercentual,
    updateConfig,
    calcularBruto,
    simularParcelamento
  };
}
