function aplicarDescuento(total, descuento) {
  if (typeof total !== 'number' || typeof descuento !== 'number') {
    throw new Error('Datos inválidos')
  }

  if (descuento < 0 || descuento > 100) {
    throw new Error('Descuento inválido')
  }

  return total - (total * descuento / 100)
}

module.exports = aplicarDescuento