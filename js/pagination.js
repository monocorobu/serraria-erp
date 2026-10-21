/**
 * SERRARIA & MADEIREIRA ERP - COMPONENTE DE PAGINAÇÃO UNIVERSAL
 * Paginação de alto desempenho com seletor de itens por página (25, 50, 100, Todos)
 * e botões de navegação inteligentes com suporte a telas responsivas.
 */

const Pagination = {
  /**
   * Recorta uma lista para a página e tamanho especificados.
   * @param {Array} items - Lista completa de itens filtrados
   * @param {number} page - Página atual (1-indexada)
   * @param {number|string} pageSize - Tamanho da página (25, 50, 100, ou 'TODOS')
   * @returns {Array} Sub-array correspondente à página
   */
  slice(items, page, pageSize) {
    if (!Array.isArray(items)) return [];
    if (pageSize === 'TODOS' || pageSize === 0 || pageSize >= items.length) {
      return items;
    }
    const size = Math.max(1, parseInt(pageSize, 10) || 25);
    const p = Math.max(1, parseInt(page, 10) || 1);
    const start = (p - 1) * size;
    return items.slice(start, start + size);
  },

  /**
   * Renderiza a barra de paginação e controles em um elemento HTML.
   * @param {Object} options
   * @param {string|HTMLElement} options.containerId - ID do container ou elemento DOM
   * @param {number} options.totalItems - Total de itens disponíveis após filtros
   * @param {number} options.currentPage - Página atual (1-indexada)
   * @param {number|string} options.pageSize - Tamanho de página selecionado
   * @param {Function} options.onPageChange - Callback chamado ao trocar de página: (newPage) => {}
   * @param {Function} options.onPageSizeChange - Callback chamado ao trocar tamanho: (newSize) => {}
   */
  render({ containerId, totalItems, currentPage, pageSize, onPageChange, onPageSizeChange }) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    if (!totalItems || totalItems <= 0) {
      container.innerHTML = '';
      return;
    }

    const isAll = pageSize === 'TODOS';
    const size = isAll ? totalItems : Math.max(1, parseInt(pageSize, 10) || 25);
    const totalPages = isAll ? 1 : Math.max(1, Math.ceil(totalItems / size));
    const curr = Math.min(Math.max(1, parseInt(currentPage, 10) || 1), totalPages);

    const startItem = totalItems === 0 ? 0 : (curr - 1) * size + 1;
    const endItem = isAll ? totalItems : Math.min(curr * size, totalItems);

    // Constrói a janela de botões numéricos (ex: 1, 2, 3, 4, 5)
    let buttonsHtml = '';
    if (totalPages > 1) {
      const maxButtons = 5;
      let startP = Math.max(1, curr - Math.floor(maxButtons / 2));
      let endP = Math.min(totalPages, startP + maxButtons - 1);
      if (endP - startP + 1 < maxButtons) {
        startP = Math.max(1, endP - maxButtons + 1);
      }

      const pagesList = [];
      for (let i = startP; i <= endP; i++) {
        pagesList.push(i);
      }

      buttonsHtml = `
        <div class="pagination-controls">
          <button type="button" class="pagination-btn pagination-nav-btn" ${curr === 1 ? 'disabled' : ''} data-page="${curr - 1}" title="Página Anterior">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span class="pagination-btn-text">Anterior</span>
          </button>

          ${startP > 1 ? `
            <button type="button" class="pagination-btn" data-page="1">1</button>
            ${startP > 2 ? '<span class="pagination-ellipsis">…</span>' : ''}
          ` : ''}

          ${pagesList.map(p => `
            <button type="button" class="pagination-btn ${p === curr ? 'active' : ''}" data-page="${p}">${p}</button>
          `).join('')}

          ${endP < totalPages ? `
            ${endP < totalPages - 1 ? '<span class="pagination-ellipsis">…</span>' : ''}
            <button type="button" class="pagination-btn" data-page="${totalPages}">${totalPages}</button>
          ` : ''}

          <button type="button" class="pagination-btn pagination-nav-btn" ${curr === totalPages ? 'disabled' : ''} data-page="${curr + 1}" title="Próxima Página">
            <span class="pagination-btn-text">Próxima</span>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="table-pagination-bar">
        <div class="pagination-left">
          <div class="pagination-size-wrap">
            <label class="pagination-label">Mostrar:</label>
            <select class="pagination-size-select" aria-label="Quantidade de itens por página">
              <option value="25" ${pageSize == 25 ? 'selected' : ''}>25</option>
              <option value="50" ${pageSize == 50 ? 'selected' : ''}>50</option>
              <option value="100" ${pageSize == 100 ? 'selected' : ''}>100</option>
              <option value="TODOS" ${pageSize === 'TODOS' ? 'selected' : ''}>Todos (${totalItems})</option>
            </select>
          </div>
          <span class="pagination-info">
            Mostrando <strong>${startItem}</strong> a <strong>${endItem}</strong> de <strong>${totalItems}</strong> ${totalItems === 1 ? 'item' : 'itens'}
          </span>
        </div>

        <div class="pagination-right">
          ${buttonsHtml}
        </div>
      </div>
    `;

    // Conecta eventos de clique e troca de tamanho
    const select = container.querySelector('.pagination-size-select');
    if (select) {
      select.addEventListener('change', (e) => {
        const val = e.target.value === 'TODOS' ? 'TODOS' : parseInt(e.target.value, 10);
        if (typeof onPageSizeChange === 'function') {
          onPageSizeChange(val);
        }
      });
    }

    container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn.disabled) return;
        const targetPage = parseInt(btn.dataset.page, 10);
        if (!isNaN(targetPage) && targetPage !== curr && typeof onPageChange === 'function') {
          onPageChange(targetPage);
        }
      });
    });
  }
};
