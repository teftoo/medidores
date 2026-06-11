function validarConsumo(actual, anterior) {
  if (typeof actual !== 'number' || typeof anterior !== 'number') {
    throw new Error('Valores deben ser números')
  }

  if (actual < anterior) {
    throw new Error('La lectura actual no puede ser menor a la anterior')
  }

  return actual - anterior
}

module.exports = validarConsumo