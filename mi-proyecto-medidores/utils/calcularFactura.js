function calcularFactura(consumo, tarifa) {
  if (typeof consumo !== 'number' || typeof tarifa !== 'number') {
    throw new Error('Los valores deben ser números')
  }

  if (consumo < 0 || tarifa < 0) {
    throw new Error('Valores negativos no permitidos')
  }

  if (consumo === 0) return 0

  return consumo * tarifa
}

module.exports = calcularFactura