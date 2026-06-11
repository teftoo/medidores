const extraerLectura = require('../utils/extraerLectura')

test('extrae correctamente un número válido', () => {
  expect(extraerLectura('Lectura actual: 12345 m3')).toBe(12345)
})

test('lanza error si no hay números', () => {
  expect(() => extraerLectura('sin datos')).toThrow()
})

test('lanza error si no es string', () => {
  expect(() => extraerLectura(12345)).toThrow()
})