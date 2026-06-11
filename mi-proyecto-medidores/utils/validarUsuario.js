function validarUsuario(nombre, email) {
  if (!nombre || !email) {
    return false;
  }

  if (!email.includes("@")) {
    return false;
  }

  return true;
}

module.exports = { validarUsuario };