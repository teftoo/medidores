const { validarUsuario } = require('../utils/validarUsuario');

test('usuario válido', () => {
  expect(validarUsuario('Juan', 'juan@gmail.com')).toBe(true);
});

test('email inválido', () => {
  expect(validarUsuario('Juan', 'juan.gmail.com')).toBe(false);
});

test('datos vacíos', () => {
  expect(validarUsuario('', '')).toBe(false);
});