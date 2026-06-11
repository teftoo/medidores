function extraerLectura(texto) {
  if (typeof texto !== 'string') {
    throw new Error('Debe ser texto')
  }

  const numeros = texto.match(/\b\d{4,8}\b/g)
  if (!numeros) {
    throw new Error('No se encontró lectura válida')
  }

  return parseInt(numeros[0])
}

module.exports = extraerLectura