import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalcEngine } from '../../services/calc.js';

export const PainelTab = () => {
  const { orders, config } = useApp();

  const [periodo, setPeriodo] = useState('MES');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(p => {
      if (!p.data_criacao) return true;
      const d = new Date(p.data_criacao);
      if (periodo === 'HOJE') {
        return d.toDateString() === now.toDateString();
      } else if (periodo === '7DIAS') {
        return (now - d) <= (7 * 24 * 60 * 60 * 1000);
      } else if (periodo === 'MES') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      return true; // TODOS
    });
  }, [orders, periodo]);

  const kpis = useMemo(() => {
    let faturamento = 0;
    let saldoPendente = 0;
    let entreguesCount = 0;

    filteredOrders.forEach(p => {
      const tot = p.resumo_financeiro?.valor_total || 0;
      const sal = p.resumo_financeiro?.saldo_a_receber || 0;
      faturamento += tot;
      saldoPendente += sal;
      if (p.status === 'ENTREGUE' || p.finalizado_balcao) entreguesCount++;
    });

    const totalPedidos = filteredOrders.length;
    const ticketMedio = totalPedidos > 0 ? faturamento / totalPedidos : 0;
    const meta = config.meta_faturamento_mensal || 150000;
    const pctMeta = meta > 0 ? Math.min(100, Math.round((faturamento / meta) * 100)) : 0;

    return { faturamento, saldoPendente, entreguesCount, totalPedidos, ticketMedio, meta, pctMeta };
  }, [filteredOrders, config]);

  // Ranking de Produtos Mais Vendidos
  const topProdutos = useMemo(() => {
    const map = {};
    filteredOrders.forEach(p => {
      (p.itens || []).forEach(it => {
        const key = it.codigo || it.descricao;
        if (!map[key]) {
          map[key] = { codigo: it.codigo, descricao: it.descricao, qtdPecas: 0, metragem: 0, total: 0 };
        }
        map[key].qtdPecas += parseFloat(it.quantidade) || 0;
        map[key].metragem += parseFloat(it.metragem_total) || 0;
        map[key].total += parseFloat(it.subtotal) || 0;
      });
    });

    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 6);
  }, [filteredOrders]);

  // Top Clientes
  const topClientes = useMemo(() => {
    const map = {};
    filteredOrders.forEach(p => {
      const cli = p.cliente?.nome || 'Cliente Balcão';
      if (!map[cli]) map[cli] = { nome: cli, total: 0, pedidos: 0 };
      map[cli].total += p.resumo_financeiro?.valor_total || 0;
      map[cli].pedidos++;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [filteredOrders]);

  return (
    <div className="painel-layout">
      {/* SELETOR DE PERÍODO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Painel Executivo da Serraria
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Visão consolidada de caixa, métricas de vendas e produtos líderes
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'HOJE', label: 'Hoje' },
            { id: '7DIAS', label: 'Últimos 7 dias' },
            { id: 'MES', label: 'Este Mês' },
            { id: 'TODOS', label: 'Todo o Histórico' }
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              className={`btn btn-sm ${periodo === opt.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPeriodo(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 KPIS EXECUTIVOS */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
        <div className="kpi-card" style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Faturamento do Período</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
            {CalcEngine.formatBRL(kpis.faturamento)}
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Ticket Médio / Pedido</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-primary)', marginTop: '4px' }}>
            {CalcEngine.formatBRL(kpis.ticketMedio)}
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Pedidos Entregues / Quitados</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
            {kpis.entreguesCount} / {kpis.totalPedidos}
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400E' }}>Saldo a Receber Pendente</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#B45309', marginTop: '4px' }}>
            {CalcEngine.formatBRL(kpis.saldoPendente)}
          </div>
        </div>

        <div className="kpi-card" style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-medium)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Atingimento da Meta ({kpis.pctMeta}%)</div>
          <div style={{ width: '100%', backgroundColor: '#E2E8F0', height: '8px', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${kpis.pctMeta}%`, backgroundColor: '#059669', height: '100%' }}></div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Meta: {CalcEngine.formatBRL(kpis.meta)}</div>
        </div>
      </div>

      {/* GRIDS DE ANÁLISE (MAIS VENDIDOS & TOP CLIENTES) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '16px' }}>
        {/* RANKING MAIS VENDIDOS */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              <span>Madeiras & Produtos Mais Vendidos</span>
            </span>
          </div>
          <div className="table-responsive">
            <table className="dense-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Cód.</th>
                  <th>Descrição</th>
                  <th style={{ width: '80px' }} className="align-center">Peças</th>
                  <th style={{ width: '110px' }} className="align-right">Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {topProdutos.map(it => (
                  <tr key={it.codigo || it.descricao}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--primary-green)' }}>{it.codigo}</td>
                    <td><strong>{it.descricao}</strong></td>
                    <td className="align-center font-mono">{it.qtdPecas}</td>
                    <td className="align-right font-mono" style={{ fontWeight: 800, color: '#047857' }}>
                      {CalcEngine.formatBRL(it.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP CLIENTES */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Principais Compradores</span>
            </span>
          </div>
          <div className="table-responsive">
            <table className="dense-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th style={{ width: '60px' }} className="align-center">Ped.</th>
                  <th style={{ width: '110px' }} className="align-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {topClientes.map(c => (
                  <tr key={c.nome}>
                    <td><strong>{c.nome}</strong></td>
                    <td className="align-center font-mono">{c.pedidos}</td>
                    <td className="align-right font-mono" style={{ fontWeight: 800, color: '#1E40AF' }}>
                      {CalcEngine.formatBRL(c.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
