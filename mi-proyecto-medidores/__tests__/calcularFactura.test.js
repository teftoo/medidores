const calcularFactura = require('../utils/calcularFactura')
//valores normales
test('calcula correctamente el total', () => {
  expect(calcularFactura(10, 0.5)).toBe(5)
})
//consumo 0
test('retorna 0 si consumo es 0', () => {
  expect(calcularFactura(0, 0.5)).toBe(0)
})

test('lanza error con valores negativos', () => {
  expect(() => calcularFactura(-10, 0.5)).toThrow()
})
//valores grandes y decimales
test('lanza error si no son números', () => {
  expect(() => calcularFactura('10', 0.5)).toThrow()
})