import React from 'react';

/**
 * Componente Reutilizável de Paginação de Tabelas
 * Suporta seletor de limite por página (10, 20, 50, 100),
 * indicador de registros e navegação completa com botões numerados e reticências.
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemLabel = 'registros'
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Gerar array de páginas com elipses se houver muitas páginas
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const pages = [];
    pages.push(1);

    if (safeCurrentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, safeCurrentPage - 1);
    const end = Math.min(totalPages - 1, safeCurrentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (safeCurrentPage < totalPages - 2) {
      pages.push('...');
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages || page === safeCurrentPage) return;
    if (onPageChange) onPageChange(page);
  };

  const handleSizeChange = (e) => {
    const newSize = Number(e.target.value);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
    // Voltar para a primeira página ao trocar o tamanho
    if (onPageChange) {
      onPageChange(1);
    }
  };

  return (
    <div className="table-pagination-bar">
      <div className="pagination-left">
        <div className="pagination-size-wrap">
          <label className="pagination-label">Exibir:</label>
          <select
            className="pagination-size-select"
            value={pageSize}
            onChange={handleSizeChange}
            aria-label="Itens por página"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} por página
              </option>
            ))}
          </select>
        </div>

        <div className="pagination-info">
          Mostrando <strong>{startItem}</strong> a <strong>{endItem}</strong> de <strong>{totalItems}</strong> {itemLabel}
        </div>
      </div>

      <div className="pagination-right">
        <div className="pagination-controls">
          <button
            type="button"
            className="pagination-btn"
            disabled={safeCurrentPage <= 1}
            onClick={() => handlePageClick(1)}
            title="Primeira página"
            aria-label="Primeira página"
          >
            &laquo;
          </button>

          <button
            type="button"
            className="pagination-btn"
            disabled={safeCurrentPage <= 1}
            onClick={() => handlePageClick(safeCurrentPage - 1)}
            title="Página anterior"
            aria-label="Página anterior"
          >
            &lsaquo; <span className="pagination-btn-text">Anterior</span>
          </button>

          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="pagination-ellipsis">
                  &hellip;
                </span>
              );
            }
            return (
              <button
                key={p}
                type="button"
                className={`pagination-btn ${p === safeCurrentPage ? 'active' : ''}`}
                onClick={() => handlePageClick(p)}
                aria-label={`Página ${p}`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            className="pagination-btn"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => handlePageClick(safeCurrentPage + 1)}
            title="Próxima página"
            aria-label="Próxima página"
          >
            <span className="pagination-btn-text">Próxima</span> &rsaquo;
          </button>

          <button
            type="button"
            className="pagination-btn"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => handlePageClick(totalPages)}
            title="Última página"
            aria-label="Última página"
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
