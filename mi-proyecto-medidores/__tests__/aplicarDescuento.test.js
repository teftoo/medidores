const aplicarDescuento = require('../utils/aplicarDescuento')

test('aplica descuento correctamente', () => {
  expect(aplicarDescuento(100, 10)).toBe(90)
})

test('sin descuento devuelve el mismo total', () => {
  expect(aplicarDescuento(100, 0)).toBe(100)
})

test('lanza error si descuento es mayor a 100', () => {
  expect(() => aplicarDescuento(100, 150)).toThrow()
})

test('lanza error si no son números', () => {
  expect(() => aplicarDescuento('100', 10)).toThrow()
})