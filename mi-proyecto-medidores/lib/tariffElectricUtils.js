/**
 * ELFEC — Tarifas Energía Eléctrica · Cochabamba
 * Empresa de Luz y Fuerza Eléctrica Cochabamba S.A.
 * Basado en estructura tarifaria AETN/SSDE (Resolución SSDE N°162/2001 y actualizaciones)
 *
 * CATEGORÍAS (Pequeña Demanda Baja Tensión — PDBT, las más comunes en edificios):
 *  - domiciliario : viviendas residenciales
 *  - general_1    : comercios pequeños, oficinas (equivale a General 1 PDBT)
 *  - comercial    : comercios medianos (General PDBT)
 *  - industrial   : talleres, pequeñas industrias (Industrial PD-BT)
 *  - social       : escuelas públicas, centros comunitarios
 *
 * CARGO MÍNIMO (incluye derecho a 20 kWh/mes):
 *  - Domiciliario: Bs 15
 *  - General 1:    Bs 20
 *  - Comercial:    Bs 35
 *  - Industrial:   Bs 45
 *  - Social:       Bs 10
 *
 * TASAS ADICIONALES:
 *  - Tasa de Aseo (GAMC): 12% sobre el consumo de energía (varía por zona)
 *  - Alumbrado Público: incluido en cargo fijo
 *
 * Los primeros 20 kWh están incluidos en el cargo mínimo.
 * A partir del kWh 21 se cobran las tarifas variables progresivas.
 *
 * Tarifas ELFEC Domiciliaria PDBT (Bs/kWh) — referencia AETN 2019/2024:
 *   21–120  kWh → 0.750 Bs/kWh
 *  121–300  kWh → 0.998 Bs/kWh
 *  301–500  kWh → 1.004 Bs/kWh
 *  501–1000 kWh → 1.316 Bs/kWh
 *  > 1000   kWh → 2.137 Bs/kWh  (reducido tras rebaja 2019: ~1.043 Bs/kWh)
 *
 * Referencia: AETN/AE, Los Tiempos 21/01/2020, SlideShare AETN 2019
 */

// ─── Tramos domiciliario (kWh 21 en adelante) ─────────────────────────────────
const TRAMOS_DOMICILIARIO = [
  { hasta: 120,      precio: 0.750 },
  { hasta: 300,      precio: 0.998 },
  { hasta: 500,      precio: 1.004 },
  { hasta: 1000,     precio: 1.316 },
  { hasta: Infinity, precio: 1.043 }, // precio post-rebaja diciembre 2019
]

// General 1 / comercio pequeño (PDBT similar a domiciliario pero sin subvención)
const TRAMOS_GENERAL1 = [
  { hasta: 120,      precio: 1.479 },
  { hasta: 700,      precio: 1.632 },
  { hasta: Infinity, precio: 1.073 },
]

// Comercial PDBT
const TRAMOS_COMERCIAL = [
  { hasta: 120,      precio: 1.479 },
  { hasta: 700,      precio: 1.632 },
  { hasta: Infinity, precio: 1.073 },
]

// Industrial Pequeña Demanda BT
const TRAMOS_INDUSTRIAL = [
  { hasta: 700,      precio: 0.943 },
  { hasta: Infinity, precio: 0.501 },
]

// Social (escuelas, centros comunitarios — tarifa preferencial)
const TRAMOS_SOCIAL = [
  { hasta: 200,      precio: 0.500 },
  { hasta: Infinity, precio: 0.750 },
]

// ─── Cargo mínimo mensual (Bs) ─────────────────────────────────────────────────
// Incluye 20 kWh de consumo base
const CARGO_MINIMO = {
  domiciliario: 15,
  general_1:    20,
  comercial:    35,
  industrial:   45,
  social:       10,
}

// ─── Tasa de aseo GAMC (% sobre consumo variable) ─────────────────────────────
const TASA_ASEO_PORCENTAJE = 0.12  // 12% estándar Cochabamba

// ─── Utilidad: calcular por tramos desde kWh 21 ───────────────────────────────
function calcularPorTramos(kwhVariables, tramos) {
  // Los primeros 20 kWh están en el cargo mínimo
  let restante = Math.max(0, kwhVariables)
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
 * Calcula la tarifa completa ELFEC
 * @param {number} consumoKwh     - Consumo total en kWh (incluyendo los primeros 20)
 * @param {string} tipoUsuario    - 'domiciliario' | 'general_1' | 'comercial' | 'industrial' | 'social'
 * @param {number} descuentoExtra - % descuento adicional 0–100
 * @param {boolean} incluirAseo   - Si se incluye tasa de aseo GAMC (default: true)
 * @returns {object}
 */
export function calcularTarifaElectricCompleta(
  consumoKwh,
  tipoUsuario   = 'domiciliario',
  descuentoExtra = 0,
  incluirAseo    = true
) {
  const tramos = {
    domiciliario: TRAMOS_DOMICILIARIO,
    general_1:    TRAMOS_GENERAL1,
    comercial:    TRAMOS_COMERCIAL,
    industrial:   TRAMOS_INDUSTRIAL,
    social:       TRAMOS_SOCIAL,
  }[tipoUsuario] ?? TRAMOS_DOMICILIARIO

  const cargoMinimo   = CARGO_MINIMO[tipoUsuario] ?? 15
  const kwhVariables  = Math.max(0, consumoKwh - 20)  // primeros 20 kWh en cargo mínimo
  const consumoVar    = calcularPorTramos(kwhVariables, tramos)
  const tasaAseo      = incluirAseo ? consumoVar * TASA_ASEO_PORCENTAJE : 0

  const totalConFactorTipo = cargoMinimo + consumoVar + tasaAseo
  const totalFinal         = totalConFactorTipo * (1 - descuentoExtra / 100)

  return {
    consumoKwh:          round(consumoKwh),
    tipoUsuario,
    cargoMinimo,
    consumoVariable:     round(consumoVar),
    kwhVariables:        round(kwhVariables),
    tasaAseo:            round(tasaAseo),
    totalConFactorTipo:  round(totalConFactorTipo),
    descuentoExtra,
    totalFinal:          round(totalFinal),
  }
}

function round(n) { return Math.round(n * 100) / 100 }

// ─── Helpers de UI ─────────────────────────────────────────────────────────────
export function getLabelTipoUsuarioElec(tipo) {
  return {
    domiciliario: 'Domiciliario (PDBT)',
    general_1:    'General 1 / Pequeño comercio',
    comercial:    'Comercial (PDBT)',
    industrial:   'Industrial (PD-BT)',
    social:       'Social/Educativo',
  }[tipo] ?? 'Desconocido'
}

export function getNivelConsumoElec(kWh) {
  if (kWh <= 120)  return 'Bajo'
  if (kWh <= 300)  return 'Moderado'
  if (kWh <= 500)  return 'Normal'
  if (kWh <= 1000) return 'Alto'
  return 'Muy alto'
}
