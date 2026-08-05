const getCurrency = () => localStorage.getItem('preferencia_moneda') || 'COP';

export const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: getCurrency(),
    minimumFractionDigits: 0,
  }).format(value || 0);

export { getCurrency };
