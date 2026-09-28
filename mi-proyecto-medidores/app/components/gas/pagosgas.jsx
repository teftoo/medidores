'use client'

import { useState } from 'react'
import {
  FaGasPump,
  FaMoneyBillWave,
  FaQrcode,
  FaCreditCard,
  FaCheckCircle,
  FaInfoCircle,
  FaLock,
  FaCar,
  FaReceipt,
  FaCalculator,
} from 'react-icons/fa'

const css = `
  .gas-root {
    --white: #ffffff;
    --off: #f8f9f8;
    --border: #e6e8e6;
    --border-md: #d0d3d0;
    --ink: #111312;
    --ink-2: #363936;
    --ink-3: #747874;
    --ink-4: #a5aaa5;

    --green: #16a34a;
    --green-dk: #117a38;
    --green-bg: #ecfdf3;
    --green-bd: #bbf7d0;

    --blue: #2563eb;
    --blue-bg: #eff6ff;
    --blue-bd: #bfdbfe;

    --amber: #d97706;
    --amber-bg: #fffbeb;
    --amber-bd: #fde68a;

    font-family: 'Inter', system-ui, sans-serif;
    color: var(--ink);
    width: 100%;
    box-sizing: border-box;
  }

  .gas-root *,
  .gas-root *::before,
  .gas-root *::after {
    box-sizing: border-box;
  }

  .gas-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 22px;
    margin-bottom: 22px;
    border-bottom: 1.5px solid var(--border);
  }

  .gas-header-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #22c55e;
    flex-shrink: 0;
  }

  .gas-title {
    font-weight: 800;
    font-size: 27px;
    letter-spacing: -0.025em;
    line-height: 1.1;
  }

  .gas-subtitle {
    font-size: 13px;
    color: var(--ink-3);
    margin-top: 5px;
  }

  .gas-info {
    background: var(--amber-bg);
    border: 1.5px solid var(--amber-bd);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--amber);
    font-size: 13px;
    margin-bottom: 22px;
  }

  .gas-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr);
    gap: 20px;
    align-items: start;
  }

  .gas-card {
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 22px;
  }

  .gas-card-title {
    display: flex;
    align-items: center;
    gap: 9px;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 18px;
  }

  .gas-card-title svg {
    color: var(--green);
  }

  .gas-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .gas-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .gas-field.full {
    grid-column: 1 / -1;
  }

  .gas-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--ink-3);
    text-transform: uppercase;
    letter-spacing: .06em;
  }

  .gas-input {
    width: 100%;
    height: 43px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 0 13px;
    outline: none;
    background: var(--white);
    color: var(--ink);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
  }

  .gas-input:focus {
    border-color: var(--green);
  }

  .gas-input:disabled {
    background: var(--off);
    color: var(--ink-3);
    cursor: not-allowed;
  }

  .gas-load-summary {
    margin-top: 18px;
    padding: 16px;
    border-radius: 13px;
    background: var(--green-bg);
    border: 1.5px solid var(--green-bd);
  }

  .gas-summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 7px 0;
    font-size: 13px;
  }

  .gas-summary-row span:first-child {
    color: var(--ink-3);
  }

  .gas-summary-total {
    border-top: 1px solid var(--green-bd);
    margin-top: 7px;
    padding-top: 13px;
    font-size: 18px;
    font-weight: 800;
  }

  .gas-summary-total span:last-child {
    color: var(--green-dk);
  }

  .gas-method-title {
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 14px;
  }

  .gas-methods {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .gas-method {
    border: 1.5px solid var(--border);
    border-radius: 13px;
    padding: 15px 10px;
    text-align: center;
    background: var(--white);
    cursor: pointer;
    transition: .18s ease;
  }

  .gas-method:hover {
    border-color: var(--border-md);
    transform: translateY(-2px);
  }

  .gas-method.selected {
    border-color: var(--green);
    background: var(--green-bg);
  }

  .gas-method-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: var(--ink);
    color: #22c55e;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 9px;
    font-size: 18px;
  }

  .gas-method.selected .gas-method-icon {
    background: var(--green);
    color: white;
  }

  .gas-method-name {
    font-size: 12px;
    font-weight: 700;
  }

  .gas-method-description {
    font-size: 10px;
    color: var(--ink-4);
    margin-top: 3px;
  }

  .gas-payment-box {
    margin-top: 16px;
    padding: 16px;
    border-radius: 13px;
    background: var(--off);
    border: 1.5px solid var(--border);
  }

  .gas-payment-header {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .gas-payment-header svg {
    color: var(--green);
  }

  .gas-payment-text {
    font-size: 12px;
    color: var(--ink-3);
    line-height: 1.55;
  }

  .gas-qr-demo {
    width: 130px;
    height: 130px;
    margin: 12px auto;
    background:
      linear-gradient(90deg, #111 8px, transparent 8px) 0 0 / 24px 24px,
      linear-gradient(#111 8px, transparent 8px) 0 0 / 24px 24px,
      white;
    border: 7px solid white;
    box-shadow: 0 0 0 1px var(--border);
  }

  .gas-cash {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px;
    border-radius: 11px;
    background: var(--green-bg);
    border: 1px solid var(--green-bd);
  }

  .gas-cash-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--green);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .gas-cash-title {
    font-size: 13px;
    font-weight: 700;
  }

  .gas-cash-text {
    font-size: 11px;
    color: var(--ink-3);
    margin-top: 2px;
  }

  .gas-button {
    width: 100%;
    border: none;
    border-radius: 12px;
    padding: 14px;
    margin-top: 16px;
    background: var(--green);
    color: white;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: .18s ease;
  }

  .gas-button:hover {
    background: var(--green-dk);
  }

  .gas-security {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 9px;
    font-size: 10px;
    color: var(--ink-4);
  }

  .gas-security svg {
    color: var(--green);
  }

  .gas-side-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 14px;
  }

  .gas-side-title svg {
    color: var(--green);
  }

  .gas-ticket {
    border: 1.5px dashed var(--border-md);
    border-radius: 13px;
    padding: 16px;
    background: var(--off);
  }

  .gas-ticket-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }

  .gas-station {
    font-weight: 800;
    font-size: 14px;
  }

  .gas-station-label {
    font-size: 10px;
    color: var(--ink-4);
    margin-top: 2px;
  }

  .gas-ticket-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 6px 0;
    font-size: 12px;
  }

  .gas-ticket-row span:first-child {
    color: var(--ink-3);
  }

  .gas-ticket-total {
    border-top: 1px solid var(--border);
    margin-top: 7px;
    padding-top: 11px;
    display: flex;
    justify-content: space-between;
    font-weight: 800;
    font-size: 16px;
  }

  .gas-ticket-total span:last-child {
    color: var(--green-dk);
  }

  .gas-help {
    margin-top: 16px;
    padding: 14px;
    border-radius: 12px;
    background: var(--blue-bg);
    border: 1px solid var(--blue-bd);
    font-size: 11px;
    line-height: 1.55;
    color: #374151;
  }

  .gas-help-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-weight: 700;
    margin-bottom: 5px;
    color: var(--blue);
  }

  .gas-success {
    text-align: center;
    padding: 35px 22px;
    background: var(--green-bg);
    border: 1.5px solid var(--green-bd);
    border-radius: 16px;
  }

  .gas-success-icon {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    background: var(--green);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    font-size: 29px;
  }

  .gas-success-title {
    font-size: 22px;
    font-weight: 800;
    color: var(--green-dk);
  }

  .gas-success-text {
    margin-top: 6px;
    font-size: 13px;
    color: var(--green-dk);
  }

  .gas-demo {
    margin-top: 9px;
    font-size: 10px;
    color: var(--ink-4);
  }

  .gas-reset {
    margin-top: 18px;
    border: 1.5px solid var(--green-bd);
    background: white;
    color: var(--green-dk);
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 600;
  }

  @media (max-width: 850px) {
    .gas-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 600px) {
    .gas-fields {
      grid-template-columns: 1fr;
    }

    .gas-field.full {
      grid-column: auto;
    }

    .gas-methods {
      grid-template-columns: 1fr;
    }
  }
`

export default function PagosGas() {
  const [metodo, setMetodo] = useState('efectivo')
  const [registrado, setRegistrado] = useState(false)

  const carga = {
    placa: '4587-KXY',
    cliente: 'GNV-002548',
    surtidor: 'Surtidor 03',
    cantidad: '12.50',
    precio: '2.50',
    total: '31.25',
  }

  const seleccionarMetodo = (tipo) => {
    setMetodo(tipo)
    setRegistrado(false)
  }

  const registrarPago = () => {
    setRegistrado(true)
  }

  const nuevoCobro = () => {
    setRegistrado(false)
    setMetodo('efectivo')
  }

  return (
    <div className="gas-root">
      <style>{css}</style>

      <div className="gas-header">
        <div className="gas-header-icon">
          <FaGasPump size={23} />
        </div>

        <div>
          <div className="gas-title">Cobro de carga GNV</div>
          <div className="gas-subtitle">
            Registro del pago correspondiente al suministro de gas vehicular
          </div>
        </div>
      </div>

      <div className="gas-info">
        <FaInfoCircle />
        <span>
          Modo demostración — el pago es simulado y no realiza ninguna
          transacción bancaria real.
        </span>
      </div>

      {!registrado ? (
        <div className="gas-layout">

          {/* DATOS DE LA CARGA */}
          <div className="gas-card">
            <div className="gas-card-title">
              <FaGasPump />
              Datos de la carga
            </div>

            <div className="gas-fields">

              <div className="gas-field">
                <label className="gas-label">Placa del vehículo</label>
                <input
                  className="gas-input"
                  value={carga.placa}
                  disabled
                />
              </div>

              <div className="gas-field">
                <label className="gas-label">Código de cliente</label>
                <input
                  className="gas-input"
                  value={carga.cliente}
                  disabled
                />
              </div>

              <div className="gas-field">
                <label className="gas-label">Surtidor</label>
                <input
                  className="gas-input"
                  value={carga.surtidor}
                  disabled
                />
              </div>

              <div className="gas-field">
                <label className="gas-label">Cantidad suministrada</label>
                <input
                  className="gas-input"
                  value={`${carga.cantidad} m³`}
                  disabled
                />
              </div>

            </div>

            <div className="gas-load-summary">

              <div className="gas-summary-row">
                <span>Gas suministrado</span>
                <strong>{carga.cantidad} m³</strong>
              </div>

              <div className="gas-summary-row">
                <span>Precio por m³</span>
                <strong>Bs {carga.precio}</strong>
              </div>

              <div className="gas-summary-row gas-summary-total">
                <span>Total a pagar</span>
                <span>Bs {carga.total}</span>
              </div>

            </div>

            <div style={{ marginTop: 22 }}>
              <div className="gas-method-title">
                Método de pago
              </div>

              <div className="gas-methods">

                <div
                  className={`gas-method ${
                    metodo === 'efectivo' ? 'selected' : ''
                  }`}
                  onClick={() => seleccionarMetodo('efectivo')}
                >
                  <div className="gas-method-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div className="gas-method-name">
                    Efectivo
                  </div>
                  <div className="gas-method-description">
                    Pago en caja
                  </div>
                </div>

                <div
                  className={`gas-method ${
                    metodo === 'qr' ? 'selected' : ''
                  }`}
                  onClick={() => seleccionarMetodo('qr')}
                >
                  <div className="gas-method-icon">
                    <FaQrcode />
                  </div>
                  <div className="gas-method-name">
                    QR
                  </div>
                  <div className="gas-method-description">
                    Pago digital
                  </div>
                </div>

                <div
                  className={`gas-method ${
                    metodo === 'tarjeta' ? 'selected' : ''
                  }`}
                  onClick={() => seleccionarMetodo('tarjeta')}
                >
                  <div className="gas-method-icon">
                    <FaCreditCard />
                  </div>
                  <div className="gas-method-name">
                    Tarjeta
                  </div>
                  <div className="gas-method-description">
                    Débito o crédito
                  </div>
                </div>

              </div>

              <div className="gas-payment-box">

                {metodo === 'efectivo' && (
                  <>
                    <div className="gas-payment-header">
                      <FaMoneyBillWave />
                      Pago en efectivo
                    </div>

                    <div className="gas-cash">
                      <div className="gas-cash-icon">
                        <FaReceipt />
                      </div>

                      <div>
                        <div className="gas-cash-title">
                          Cobrar Bs {carga.total}
                        </div>

                        <div className="gas-cash-text">
                          El operador recibe el efectivo y entrega el comprobante
                          de la carga.
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {metodo === 'qr' && (
                  <>
                    <div className="gas-payment-header">
                      <FaQrcode />
                      Pago mediante QR
                    </div>

                    <div className="gas-qr-demo" />

                    <div
                      className="gas-payment-text"
                      style={{ textAlign: 'center' }}
                    >
                      Código QR simulado para el pago de la carga.
                      <br />
                      Monto: <strong>Bs {carga.total}</strong>
                    </div>
                  </>
                )}

                {metodo === 'tarjeta' && (
                  <>
                    <div className="gas-payment-header">
                      <FaCreditCard />
                      Pago con tarjeta
                    </div>

                    <div className="gas-fields">
                      <div className="gas-field full">
                        <label className="gas-label">
                          Número de tarjeta
                        </label>
                        <input
                          className="gas-input"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>

                      <div className="gas-field">
                        <label className="gas-label">
                          Vencimiento
                        </label>
                        <input
                          className="gas-input"
                          placeholder="MM/AA"
                        />
                      </div>

                      <div className="gas-field">
                        <label className="gas-label">
                          CVV
                        </label>
                        <input
                          className="gas-input"
                          placeholder="000"
                        />
                      </div>
                    </div>
                  </>
                )}

              </div>

              <button
                className="gas-button"
                onClick={registrarPago}
              >
                <FaCheckCircle />
                Registrar pago de Bs {carga.total}
              </button>

              <div className="gas-security">
                <FaLock />
                Registro protegido — demostración sin transacción real
              </div>

            </div>
          </div>

          {/* RESUMEN */}
          <div className="gas-card">

            <div className="gas-side-title">
              <FaCalculator />
              Resumen del cobro
            </div>

            <div className="gas-ticket">

              <div className="gas-ticket-top">
                <div>
                  <div className="gas-station">
                    ESTACIÓN GNV
                  </div>
                  <div className="gas-station-label">
                    Comprobante de carga
                  </div>
                </div>

                <FaGasPump
                  size={20}
                  style={{ color: 'var(--green)' }}
                />
              </div>

              <div className="gas-ticket-row">
                <span>Vehículo</span>
                <strong>{carga.placa}</strong>
              </div>

              <div className="gas-ticket-row">
                <span>Cliente</span>
                <strong>{carga.cliente}</strong>
              </div>

              <div className="gas-ticket-row">
                <span>Surtidor</span>
                <strong>{carga.surtidor}</strong>
              </div>

              <div className="gas-ticket-row">
                <span>Cantidad</span>
                <strong>{carga.cantidad} m³</strong>
              </div>

              <div className="gas-ticket-row">
                <span>Precio/m³</span>
                <strong>Bs {carga.precio}</strong>
              </div>

              <div className="gas-ticket-total">
                <span>Total</span>
                <span>Bs {carga.total}</span>
              </div>

            </div>

            <div className="gas-help">
              <div className="gas-help-title">
                <FaInfoCircle />
                ¿Para qué sirve esta pantalla?
              </div>

              Permite al personal de la estación registrar visualmente
              el pago realizado por el cliente después de cargar GNV.
              El sistema muestra la cantidad suministrada, el costo y
              el método de pago seleccionado.
            </div>

          </div>

        </div>
      ) : (

        <div className="gas-success">

          <div className="gas-success-icon">
            <FaCheckCircle />
          </div>

          <div className="gas-success-title">
            ¡Pago registrado!
          </div>

          <div className="gas-success-text">
            La carga de {carga.cantidad} m³ de GNV fue registrada
            correctamente por un total de Bs {carga.total}.
          </div>

          <div className="gas-demo">
            Método: {
              metodo === 'efectivo'
                ? 'Efectivo'
                : metodo === 'qr'
                ? 'Código QR'
                : 'Tarjeta'
            }
            {' · '}
            Surtidor: {carga.surtidor}
          </div>

          <div className="gas-demo">
            Simulación — no se realizó ninguna transacción real.
          </div>

          <button
            className="gas-reset"
            onClick={nuevoCobro}
          >
            Registrar otra carga
          </button>

        </div>

      )}
    </div>
  )
}