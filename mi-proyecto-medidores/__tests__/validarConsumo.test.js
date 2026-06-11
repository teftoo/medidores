const validarConsumo = require('../utils/validarConsumo')

test('calcula correctamente el consumo', () => {
  expect(validarConsumo(150, 100)).toBe(50)
})

test('retorna 0 si son iguales', () => {
  expect(validarConsumo(100, 100)).toBe(0)
})

test('lanza error si actual es menor', () => {
  expect(() => validarConsumo(90, 100)).toThrow()
})

test('lanza error si no son números', () => {
  expect(() => validarConsumo('100', 50)).toThrow()
})