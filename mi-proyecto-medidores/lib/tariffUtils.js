/**
 * SEMAPA — Tarifas de Agua Potable · Cochabamba
 * Basado en la estructura tarifaria vigente (RAR N°383/2019 y propuesta 2021+)
 *
 * CATEGORÍAS:
 *  - doméstico_solidario : ≤ 10 m³/mes  → tarifa mínima + cargo fijo Bs 5
 *  - doméstico           : > 10 m³/mes  → tarifas progresivas por tramo
 *  - comercial           : negocio, agua para consumo humano
 *  - industrial          : agua como insumo productivo
 *  - estatal             : escuelas, hospitales, entidades públicas
 *
 * ALCANTARILLADO:
 *  - Domiciliario: 40% del total de agua  (propuesta nueva: 60%, se usa valor vigente)
 *  - Comercial/Industrial: 60% del total de agua
 *
 * CARGO FIJO (disponibilidad de servicio):
 *  - Doméstico solidario: Bs 5
 *  - Doméstico:          Bs 10
 *  - Comercial:          Bs 30
 *  - Industrial:         Bs 50
 *  - Estatal:            Bs 20
 *
 * FORMULARIO: Bs 2 (todas las categorías)
 *
 * Referencia: SEMAPA, Los Tiempos 01/02/2021, Bolivia Emprende 23/01/2020
 */

// ─── Tarifas por m³ según tramos (Bs/m³) ──────────────────────────────────────

const TRAMOS_DOMESTICO_SOLIDARIO = [
  // 0–10 m³ → Bs 1.50/m³  (tarifa mínima para consumo ≤ 10 m³)
  { hasta: 10, precio: 1.50 },
]

const TRAMOS_DOMESTICO = [
  // > 10 m³ · estructura escalonada SEMAPA
  { hasta: 10, precio: 2.00 },   // primeros 10 m³
  { hasta: 16, precio: 2.50 },   // 11–16 m³
  { hasta: 20, precio: 5.00 },   // 17–20 m³
  { hasta: 30, precio: 10.00 },  // 21–30 m³
  { hasta: Infinity, precio: 15.00 }, // > 30 m³
]

const TRAMOS_COMERCIAL = [
  { hasta: 20,       precio: 8.00 },
  { hasta: Infinity, precio: 12.00 },
]

const TRAMOS_INDUSTRIAL = [
  { hasta: 30,       precio: 10.00 },
  { hasta: Infinity, precio: 15.00 },
]

const TRAMOS_ESTATAL = [
  { hasta: 50,       precio: 10.00 },
  { hasta: Infinity, precio: 20.00 },
]

// ─── Cargos fijos por categoría (Bs) ──────────────────────────────────────────
const CARGO_FIJO = {
  domestico_solidario: 5,
  domestico:           10,
  comercial:           30,
  industrial:          50,
  estatal:             20,
}

// ─── Factor de alcantarillado ──────────────────────────────────────────────────
const FACTOR_ALCANTARILLADO = {
  domestico_solidario: 0.40,
  domestico:           0.40,
  comercial:           0.60,
  industrial:          0.60,
  estatal:             0.40,
}

// ─── Utilidad: calcular consumo por tramos ─────────────────────────────────────
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
 * Calcula la tarifa completa SEMAPA
 * @param {number} consumoM3       - Consumo en metros cúbicos
 * @param {string} tipoUsuario     - 'domestico_solidario' | 'domestico' | 'comercial' | 'industrial' | 'estatal'
 * @param {number} descuentoExtra  - % descuento adicional (jubilados, discapacitados, etc.) 0–100
 * @returns {object}
 */
export function calcularTarifaCompleta(consumoM3, tipoUsuario = 'domestico', descuentoExtra = 0) {
  // Auto-clasificar doméstico solidario si consumo ≤ 10 m³
  const categoria = (tipoUsuario === 'domestico' && consumoM3 <= 10)
    ? 'domestico_solidario'
    : tipoUsuario

  // Seleccionar tramos
  const tramos = {
    domestico_solidario: TRAMOS_DOMESTICO_SOLIDARIO,
    domestico:           TRAMOS_DOMESTICO,
    comercial:           TRAMOS_COMERCIAL,
    industrial:          TRAMOS_INDUSTRIAL,
    estatal:             TRAMOS_ESTATAL,
  }[categoria] ?? TRAMOS_DOMESTICO

  const cargoFijo        = CARGO_FIJO[categoria] ?? 10
  const factorAlcant     = FACTOR_ALCANTARILLADO[categoria] ?? 0.40
  const formulario       = 2

  // Cálculo
  const subtotal         = calcularPorTramos(consumoM3, tramos)   // solo agua
  const alcantarillado   = subtotal * factorAlcant
  const totalConFactorTipo = subtotal + alcantarillado + cargoFijo + formulario
  const totalFinal       = totalConFactorTipo * (1 - descuentoExtra / 100)

  return {
    consumoM3:           round(consumoM3),
    categoria,
    subtotal:            round(subtotal),
    alcantarillado:      round(alcantarillado),
    cargoFijo,
    formulario,
    totalConFactorTipo:  round(totalConFactorTipo),
    descuentoExtra,
    totalFinal:          round(totalFinal),
  }
}

function round(n) { return Math.round(n * 100) / 100 }

// ─── Helpers de UI ─────────────────────────────────────────────────────────────
export function getLabelTipoUsuario(tipo) {
  return {
    domestico_solidario: 'Doméstico Solidario (≤10 m³)',
    domestico:           'Doméstico',
    comercial:           'Comercial',
    industrial:          'Industrial',
    estatal:             'Estatal',
  }[tipo] ?? 'Desconocido'
}
