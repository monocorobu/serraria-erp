import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function TutorialTab({ onCarregarExemplo }) {
  const { resetDemo, showToast, setActiveTab, orders } = useApp();

  const handleRestaurarDemo = () => {
    if (window.confirm('Tem certeza que deseja restaurar todos os dados para os padrões de fábrica do sistema?')) {
      resetDemo();
      showToast('Dados de demonstração restaurados com sucesso!', 'success');
      setActiveTab('balcao');
    }
  };

  const handleCarregarExemplo = () => {
    if (onCarregarExemplo) {
      onCarregarExemplo('PED-1022');
    } else {
      setActiveTab('balcao');
    }
    showToast('Exemplo guiado carregado no balcão! Observe as linhas de madeira e o botão de Plaina.', 'info');
  };

  return (
    <section className="tab-content active" id="tab-tutorial">
      <div className="panel">
        <div className="panel-header" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'var(--brand-primary)', fill: 'none', strokeWidth: 2.2 }}>
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Manual Operacional & Guia de Treinamento da Madeireira
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Instruções passo a passo para o atendimento no balcão, expedição no pátio e fechamento de caixa do dono
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className="btn btn-sm btn-primary"
              id="btn-carregar-exemplo-guiado"
              style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              onClick={handleCarregarExemplo}
            >
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Carregar Exemplo Prático no Balcão</span>
            </button>
            <button
              className="btn btn-sm btn-secondary"
              id="btn-restaurar-dados-demo"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              onClick={handleRestaurarDemo}
            >
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}>
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>Restaurar Demonstração Original</span>
            </button>
          </div>
        </div>

        <div className="panel-body" style={{ lineHeight: 1.6, fontSize: 13, padding: 20 }}>
          
          {/* BLOCO 1: O PASSO A PASSO ESSENCIAL DO ATENDIMENTO (CARDS 1 A 4) */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge-tag" style={{ background: 'var(--brand-primary)', color: '#fff', fontSize: 11, padding: '2px 8px' }}>PASSO A PASSO</span>
              Fluxo de Atendimento no Balcão
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              
              {/* CARD 1 */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-medium)', borderTop: '3px solid #059669', borderRadius: 'var(--radius-md)', padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#ECFDF5', color: '#047857', fontWeight: 800, width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>1</span>
                  <strong style={{ color: '#047857', fontSize: '13.5px' }}>Identificar o Cliente</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginBottom: 8 }}>
                  Digite o telefone, nome ou CPF no campo de busca. Se o cliente já comprou, o endereço e bairro são preenchidos na hora.
                </p>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: 4, fontSize: '11.5px', color: '#334155' }}>
                  💡 <strong>Auto-cadastro:</strong> Para clientes novos, basta preencher o <em>Nome</em> e <em>Bairro</em> — o sistema cadastra sozinho ao salvar o pedido!
                </div>
              </div>

              {/* CARD 2 */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-medium)', borderTop: '3px solid #0284C7', borderRadius: 'var(--radius-md)', padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#F0F9FF', color: '#0284C7', fontWeight: 800, width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>2</span>
                  <strong style={{ color: '#0284C7', fontSize: '13.5px' }}>Adicionar Madeiras e Itens</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginBottom: 8 }}>
                  Busque a madeira pelo nome ou código. Escolha a quantidade de peças e o comprimento (ex: 3.0m, 4.0m).
                </p>
                <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '6px 10px', borderRadius: 4, fontSize: '11.5px', color: '#0369A1' }}>
                  🪵 <strong>Plaina:</strong> Se o cliente quiser madeira lisa, selecione <strong>Aparelhada (+Plaina)</strong>. O sistema calcula a taxa de plaina e o pátio já recebe o aviso.
                </div>
              </div>

              {/* CARD 3 */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-medium)', borderTop: '3px solid #D97706', borderRadius: 'var(--radius-md)', padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#FFFBEB', color: '#D97706', fontWeight: 800, width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>3</span>
                  <strong style={{ color: '#D97706', fontSize: '13.5px' }}>Fechamento (Balcão vs Pátio)</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginBottom: 8 }}>
                  Escolha o tipo de operação correto nos botões de ação:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '11.5px' }}>
                  <div style={{ background: '#ECFDF5', padding: '4px 8px', borderRadius: 4, color: '#047857' }}>
                    ⚡ <strong>[F8] Finalizar Venda Balcão:</strong> Para retirada imediata (pregos, ferragens ou madeira pronta). Quita 100% e baixa o estoque na hora.
                  </div>
                  <div style={{ background: '#EFF6FF', padding: '4px 8px', borderRadius: 4, color: '#1E40AF' }}>
                    🚚 <strong>Aprovar Venda (Pátio):</strong> Para madeiras que vão para corte, plaina ou entrega agendada de caminhão.
                  </div>
                </div>
              </div>

              {/* CARD 4 */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-medium)', borderTop: '3px solid #2563EB', borderRadius: 'var(--radius-md)', padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: '#EFF6FF', color: '#2563EB', fontWeight: 800, width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>4</span>
                  <strong style={{ color: '#2563EB', fontSize: '13.5px' }}>WhatsApp & Comprovantes</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', marginBottom: 8 }}>
                  Após o pedido, envie as informações para o cliente com 1 clique:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: '11.5px' }}>
                  <div style={{ background: '#F0FDF4', padding: '4px 8px', borderRadius: 4, color: '#15803D' }}>
                    💬 <strong>WhatsApp:</strong> Puxa o número do cliente e abre a conversa com o orçamento todo formatado com preços à vista e a prazo.
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '4px 8px', borderRadius: 4, color: '#334155' }}>
                    🖨️ <strong>[F9] Imprimir:</strong> Abre a via comercial em A5 Paisagem com Preço À Vista e Preço Bruto ou o Romaneio do Pátio.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* BLOCO 2: RECURSOS CRÍTICOS (ESTOQUE, CAIXA, ATALHOS) */}
          <div className="tutorial-grid-2">
            
            {/* COMO FUNCIONA A TRAVA DE ESTOQUE */}
            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="panel-header" style={{ background: '#FEF2F2' }}>
                <span className="panel-title" style={{ color: '#991B1B', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: '#DC2626', fill: 'none', strokeWidth: 2.2 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Conferência Física de Estoque (Sem Travas Cegas)
                </span>
              </div>
              <div className="panel-body compact" style={{ fontSize: 12 }}>
                <p style={{ marginBottom: 8 }}>
                  Na serraria é comum chegar mercadoria que ainda não foi lançada no computador. O sistema possui uma <strong>trava inteligente</strong>:
                </p>
                <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, color: '#475569', marginBottom: 10 }}>
                  <li>Se você tentar vender um item com <strong>saldo zerado</strong> ou <strong>insuficiente</strong>, a tela de conferência física se abre automaticamente.</li>
                  <li><strong>Acertar na Hora:</strong> Se você olhou a prateleira e viu que tem o produto (ex: 50 pacotes de pregos ou 20 caibros), digite a quantidade real no campo e clique em <strong>✓ Salvar Estoque</strong>. O sistema atualiza o saldo na hora e prossegue com a venda!</li>
                  <li><strong>Liberar Venda:</strong> Se a conferência já foi feita visualmente no balcão, basta clicar no botão verde <strong>Mercadoria Conferida no Balcão</strong> para liberar sem burocracia.</li>
                </ul>
                <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 4, padding: '6px 10px', color: '#92400E', fontSize: 11 }}>
                  🛡️ <strong>Zero surpresas:</strong> Nenhuma venda passa sem que você saiba exatamente a situação do estoque.
                </div>
              </div>
            </div>

            {/* COMO USAR O PAINEL DO DONO & CAIXA */}
            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="panel-header" style={{ background: '#ECFDF5' }}>
                <span className="panel-title" style={{ color: '#065F46', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: '#059669', fill: 'none', strokeWidth: 2.2 }}>
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  Painel do Dono, Caixa & Ranking
                </span>
              </div>
              <div className="panel-body compact" style={{ fontSize: 12 }}>
                <p style={{ marginBottom: 8 }}>
                  O <strong>Painel do Dono</strong> foi projetado para dar clareza total dos números da empresa:
                </p>
                <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, color: '#475569', marginBottom: 10 }}>
                  <li><strong>Filtros por Período:</strong> Alterne entre <em>Hoje</em>, <em>Últimos 7 dias</em>, <em>Este Mês</em> ou <em>Todo o Histórico</em> com 1 clique.</li>
                  <li><strong>Fechamento de Caixa:</strong> Veja exatamente quanto entrou em <strong>Pix</strong>, <strong>Dinheiro</strong> e <strong>Cartão</strong>, separando os sinais dos recebimentos na descarga.</li>
                  <li><strong>Ranking dos Mais Vendidos:</strong> Descubra quais produtos mais trazem dinheiro para o caixa da madeireira e quais têm maior volume de saída.</li>
                  <li><strong>Top Clientes:</strong> Identifique os 5 maiores compradores do período para manter relacionamento e fidelizar.</li>
                </ul>
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 4, padding: '6px 10px', color: '#166534', fontSize: 11 }}>
                  💼 <strong>Gestão em Tempo Real:</strong> Cada venda finalizada no balcão reflete imediatamente no caixa e no ranking.
                </div>
              </div>
            </div>

          </div>

          {/* BLOCO 3: ATALHOS DE TECLADO & FÓRMULAS DA MADEIREIRA */}
          <div className="tutorial-grid-2" style={{ marginBottom: 0 }}>
            
            {/* TABELA DE ATALHOS */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: 'var(--brand-primary)', fill: 'none', strokeWidth: 2 }}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="6" y1="8" x2="6" y2="8" />
                  <line x1="10" y1="8" x2="10" y2="8" />
                  <line x1="14" y1="8" x2="14" y2="8" />
                  <line x1="18" y1="8" x2="18" y2="8" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                  <line x1="6" y1="16" x2="10" y2="16" />
                  <line x1="14" y1="16" x2="18" y2="16" />
                </svg>
                Teclas de Atalho Oficiais (Agilidade no Balcão)
              </h4>
              
              <div className="table-responsive">
                <table className="dense-table">
                  <thead>
                    <tr>
                      <th style={{ width: 75 }} className="align-center">Tecla</th>
                      <th>Ação no Sistema</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="align-center"><kbd className="font-mono" style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>F2</kbd></td>
                      <td><strong>Limpar e Iniciar Novo Orçamento</strong> (Prepara a tela para o próximo cliente)</td>
                    </tr>
                    <tr>
                      <td className="align-center"><kbd className="font-mono" style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#047857', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>F8</kbd></td>
                      <td><strong>Finalizar Venda Balcão</strong> (Pronta entrega: quita 100% e baixa o estoque)</td>
                    </tr>
                    <tr>
                      <td className="align-center"><kbd className="font-mono" style={{ background: '#EFF6FF', border: '1px solid #3B82F6', color: '#1D4ED8', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>F9</kbd></td>
                      <td><strong>Imprimir Pedido / Comprovante</strong> (Abre a prévia com opção de Via Cliente ou Pátio)</td>
                    </tr>
                    <tr>
                      <td className="align-center"><kbd className="font-mono" style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>Enter</kbd></td>
                      <td>Na barra rápida de produtos, <strong>adiciona o item diretamente à tabela</strong></td>
                    </tr>
                    <tr>
                      <td className="align-center"><kbd className="font-mono" style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>Esc</kbd></td>
                      <td>Fecha qualquer janela ou tela sobreposta aberta</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* FÓRMULAS DA MADEIREIRA */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: 'var(--brand-primary)', fill: 'none', strokeWidth: 2 }}>
                  <polyline points="4 7 4 4 20 4 20 7" />
                  <line x1="9" y1="20" x2="15" y2="20" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
                Fórmulas Matemáticas do Motor Madeireiro
              </h4>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-light)', padding: 12, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                <div>
                  <strong style={{ color: 'var(--brand-primary-text)' }}>1. Metro Linear (ML) — Vigas, Caibros e Ripas:</strong><br />
                  <code>Metragem Total (ML) = Quantidade de Peças × Comprimento (m)</code>
                </div>
                <div>
                  <strong style={{ color: 'var(--brand-primary-text)' }}>2. Volume Cúbico (m³):</strong><br />
                  <code>Volume (m³) = Peças × (Espessura/100) × (Largura/100) × Comprimento (m)</code>
                </div>
                <div>
                  <strong style={{ color: 'var(--brand-primary-text)' }}>3. Peso Estimado da Carga (kg) para o Caminhão:</strong><br />
                  <code>Peso (kg) = Volume (m³) × Densidade Específica da Madeira</code>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', borderTop: '1px dashed var(--border-medium)', paddingTop: 6, marginTop: 2 }}>
                  🌲 <strong>Densidades calibradas no sistema:</strong> Garapeira e Peroba Rosa (~850 a 880 kg/m³), Pinus Seco (~500 kg/m³), Telhas cerâmicas (~2,2 kg/un).
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
