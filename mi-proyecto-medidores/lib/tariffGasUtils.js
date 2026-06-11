/**
 * YPFB Redes de Gas — Tarifas Gas Natural Domiciliario · Cochabamba
 * Basado en información oficial YPFB y estructura tarifaria vigente
 *
 * CATEGORÍAS:
 *  - domestico  : vivienda familiar  (~Bs 8 mínimo, ~Bs 24 consumo medio 3 garrafas equiv.)
 *  - comercial  : locales comerciales, restaurantes, panaderías
 *  - industrial : fábricas, industrias, uso como insumo
 *  - social     : escuelas, centros comunitarios, asilos
 *
 * CARGO MÍNIMO (disponibilidad de servicio):
 *  - Doméstico:  Bs 8  (tarifa mínima mensual según YPFB)
 *  - Comercial:  Bs 25
 *  - Industrial: Bs 60
 *  - Social:     Bs 8
 *
 * NOTA: YPFB mantiene tarifas de gas natural muy bajas por política de
 * subsidio estatal. El gas domiciliario es aproximadamente 3x más barato
 * que el GLP en garrafas (Bs 24 vs Bs 67.50 para consumo equivalente).
 *
 * Referencia: YPFB/La Razón 14/03/2013, YPFB Redes de Gas Cochabamba
 */

// ─── Tarifas por m³ según tramos (Bs/m³) ──────────────────────────────────────

const TRAMOS_DOMESTICO = [
  // Tarifa subsidiada — política de Estado
  { hasta: 5,        precio: 0.60 },  // primeros 5 m³ (mínimo vital)
  { hasta: 15,       precio: 0.85 },  // 6–15 m³
  { hasta: 30,       precio: 1.10 },  // 16–30 m³
  { hasta: Infinity, precio: 1.50 },  // > 30 m³
]

const TRAMOS_COMERCIAL = [
  { hasta: 10,       precio: 1.80 },
  { hasta: 30,       precio: 2.50 },
  { hasta: Infinity, precio: 3.50 },
]

const TRAMOS_INDUSTRIAL = [
  { hasta: 50,       precio: 2.20 },
  { hasta: 200,      precio: 3.00 },
  { hasta: Infinity, precio: 4.00 },
]

const TRAMOS_SOCIAL = [
  { hasta: 20,       precio: 0.50 },  // tarifa preferencial
  { hasta: Infinity, precio: 0.80 },
]

// ─── Cargo mínimo mensual por categoría (Bs) ──────────────────────────────────
const CARGO_MINIMO = {
  domestico:  8,
  comercial:  25,
  industrial: 60,
  social:     8,
}

// ─── Utilidad: calcular por tramos ────────────────────────────────────────────
function calcularPorTramos(m3, tramos) {
  let restante = Math.max(0, m3)
  let total = 0
  let limiteAnterior = 0

  for (const tramo of tramos) {
    if (restante <= 0) break
    const capacidad = tramo.hasta === Infinity ? restante : tramo.hasta - limiteAnterior
    const consumido = Math.min(restante, capacidad)
    total += consumido * tramo.precio
    restante -= consumido
    limiteAnterior = tramo.hasta
  }
  return total
}

// ─── Función principal ─────────────────────────────────────────────────────────
/**
 * Calcula la tarifa completa YPFB Gas Natural
 * @param {number} consumoM3      - Consumo en metros cúbicos
 * @param {string} tipoUsuario    - 'domestico' | 'comercial' | 'industrial' | 'social'
 * @param {number} descuentoExtra - % descuento adicional (jubilados, discapacidad) 0–100
 * @returns {object}
 */
export function calcularTarifaGasCompleta(consumoM3, tipoUsuario = 'domestico', descuentoExtra = 0) {
  const tramos = {
    domestico:  TRAMOS_DOMESTICO,
    comercial:  TRAMOS_COMERCIAL,
    industrial: TRAMOS_INDUSTRIAL,
    social:     TRAMOS_SOCIAL,
  }[tipoUsuario] ?? TRAMOS_DOMESTICO

  const cargoMinimo = CARGO_MINIMO[tipoUsuario] ?? 8

  const subtotal           = calcularPorTramos(consumoM3, tramos)
  const totalConFactorTipo = Math.max(subtotal + cargoMinimo, cargoMinimo)
  const totalFinal         = totalConFactorTipo * (1 - descuentoExtra / 100)

  return {
    consumoM3:           round(consumoM3),
    tipoUsuario,
    subtotal:            round(subtotal),
    cargoMinimo,
    totalConFactorTipo:  round(totalConFactorTipo),
    descuentoExtra,
    totalFinal:          round(totalFinal),
  }
}

function round(n) { return Math.round(n * 100) / 100 }

export function getLabelTipoUsuarioGas(tipo) {
  return {
    domestico:  'Doméstico/Residencial',
    comercial:  'Comercial',
    industrial: 'Industrial',
    social:     'Social/Comunitario',
  }[tipo] ?? 'Desconocido'
}

export function getAhorroVsGarrafa(consumoM3) {
  const garrafasEquiv = consumoM3 / 2.5
  const costoGarrafa  = garrafasEquiv * 22.50
  const costoGas      = calcularTarifaGasCompleta(consumoM3).totalFinal
  return round(costoGarrafa - costoGas)
}
