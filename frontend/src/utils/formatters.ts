// Formatear números como moneda entera
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

// Formatear números sin símbolo de moneda
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

// Convertir string de input a entero
export function parseAmountInput(value: string): number {
  // Remover caracteres no numéricos excepto el signo negativo
  const cleanValue = value.replace(/[^\d-]/g, '');
  const parsed = parseInt(cleanValue, 10);
  return isNaN(parsed) ? 0 : parsed;
}

// Validar que un valor sea un entero positivo
export function isValidAmount(value: string): boolean {
  const parsed = parseAmountInput(value);
  return parsed > 0;
}