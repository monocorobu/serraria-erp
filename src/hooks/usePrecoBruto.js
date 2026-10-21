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
    CalcEngine.setPercentualPrecoBruto(val);
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

  return {
    config,
    setConfig,
    percentual,
    updatePercentual,
    calcularBruto,
    simularParcelamento
  };
}
