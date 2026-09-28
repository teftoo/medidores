'use client'

import { useState } from 'react'
import {
  FaFire,
  FaHashtag,
  FaClipboardCheck,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUser,
} from 'react-icons/fa'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .gas-root {
    --bg: #f7f7f5;
    --white: #ffffff;
    --border: #e7e7e4;
    --text: #171716;
    --muted: #777773;
    --orange: #ea580c;
    --orange-light: #fff1e8;
    --green: #16a34a;

    min-height: 100%;
    padding: 28px;
    background: var(--bg);
    font-family: 'Inter', sans-serif;
    color: var(--text);
  }

  .gas-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  /* HEADER */

  .gas-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 28px;
  }

  .gas-title-section {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .gas-icon {
    width: 52px;
    height: 52px;
    border-radius: 15px;
    background: #171716;
    color: var(--orange);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 21px;
  }

  .gas-title {
    font-size: 24px;
    font-weight: 800;
    margin: 0;
  }

  .gas-subtitle {
    margin-top: 4px;
    font-size: 13px;
    color: var(--muted);
  }

  .gas-status {
    display: flex;
    align-items: center;
    gap: 7px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: var(--green);
    padding: 9px 13px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
  }

  .gas-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--green);
  }

  /* GRID */

  .gas-grid {
    display: grid;
    grid-template-columns: 1.3fr .7fr;
    gap: 20px;
  }

  /* CARD */

  .gas-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 17px;
    overflow: hidden;
  }

  .gas-card-header {
    padding: 17px 20px;
    background: #171716;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .gas-card-header h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
  }

  .gas-card-header span {
    display: block;
    margin-top: 3px;
    color: rgba(255,255,255,.5);
    font-size: 11px;
  }

  .gas-card-body {
    padding: 22px;
  }

  /* INFO */

  .gas-info {
    background: var(--orange-light);
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 22px;
    font-size: 13px;
    line-height: 1.5;
    color: #9a3412;
  }

  /* FORM */

  .gas-field {
    margin-bottom: 18px;
  }

  .gas-label {
    display: block;
    margin-bottom: 7px;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
  }

  .gas-input {
    width: 100%;
    height: 52px;
    border: 1.5px solid var(--border);
    border-radius: 11px;
    background: #fafaf9;
    padding: 0 15px;
    outline: none;
    font-family: 'Inter';
    font-size: 16px;
    font-weight: 600;
    transition: .15s;
  }

  .gas-input:focus {
    background: white;
    border-color: var(--orange);
  }

  .gas-input-wrapper {
    position: relative;
  }

  .gas-input-wrapper svg {
    position: absolute;
    left: 15px;
    top: 18px;
    color: #aaa;
  }

  .gas-input-wrapper .gas-input {
    padding-left: 42px;
  }

  /* METER */

  .gas-meter {
    background: #171716;
    border-radius: 13px;
    padding: 18px;
    margin-bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }

  .gas-meter-label {
    color: rgba(255,255,255,.55);
    font-size: 11px;
  }

  .gas-meter-number {
    margin-top: 5px;
    color: var(--orange);
    font-size: 25px;
    font-weight: 800;
    letter-spacing: 3px;
  }

  .gas-meter-unit {
    color: white;
    font-size: 12px;
    font-weight: 600;
  }

  /* BUTTON */

  .gas-button {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 11px;
    background: #171716;
    color: white;
    font-family: 'Inter';
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: .15s;
  }

  .gas-button:hover {
    opacity: .88;
  }

  /* SUMMARY */

  .gas-summary {
    display: flex;
    flex-direction: column;
  }

  .gas-summary-row {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }

  .gas-summary-row:last-child {
    border-bottom: none;
  }

  .gas-summary-label {
    color: var(--muted);
  }

  .gas-summary-value {
    font-weight: 600;
    text-align: right;
  }

  /* SUCCESS */

  .gas-success {
    margin-top: 18px;
    padding: 13px;
    border-radius: 10px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: var(--green);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
  }

  /* RESPONSIVE */

  @media (max-width: 800px) {
    .gas-root {
      padding: 18px;
    }

    .gas-grid {
      grid-template-columns: 1fr;
    }

    .gas-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .gas-root {
      padding: 14px;
    }

    .gas-title {
      font-size: 20px;
    }

    .gas-card-body {
      padding: 16px;
    }
  }
`

export default function MedidorGas() {
  const [lectura, setLectura] = useState('')
  const [registrado, setRegistrado] = useState(false)

  const registrarLectura = () => {
    if (!lectura) return

    setRegistrado(true)

    setTimeout(() => {
      setRegistrado(false)
    }, 3000)
  }

  return (
    <div className="gas-root">
      <style>{css}</style>

      <div className="gas-container">

        {/* HEADER */}
        <div className="gas-header">

          <div className="gas-title-section">

            <div className="gas-icon">
              <FaFire />
            </div>

            <div>
              <h1 className="gas-title">
                Medidores de Gas
              </h1>

              <div className="gas-subtitle">
                Registro manual de lecturas de consumo
              </div>
            </div>

          </div>

          <div className="gas-status">
            <span className="gas-status-dot" />
            Estación activa
          </div>

        </div>


        {/* CONTENIDO */}
        <div className="gas-grid">

          {/* IZQUIERDA */}

          <div className="gas-card">

            <div className="gas-card-header">

              <FaClipboardCheck />

              <div>
                <h2>Registrar lectura</h2>

                <span>
                  Ingresá manualmente los datos del medidor
                </span>
              </div>

            </div>


            <div className="gas-card-body">

              <div className="gas-info">
                <strong>Registro manual:</strong>{' '}
                verificá el número que aparece en la pantalla
                física del medidor e ingresalo en el formulario.
              </div>


              {/* EJEMPLO MEDIDOR */}

              <div className="gas-meter">

                <div>
                  <div className="gas-meter-label">
                    LECTURA DEL MEDIDOR
                  </div>

                  <div className="gas-meter-number">
                    {lectura || '0085045'}
                  </div>
                </div>

                <div className="gas-meter-unit">
                  m³
                </div>

              </div>


              {/* MEDIDOR */}

              <div className="gas-field">

                <label className="gas-label">
                  Número de medidor
                </label>

                <div className="gas-input-wrapper">
                  <FaHashtag />

                  <input
                    className="gas-input"
                    type="text"
                    placeholder="Ej. GAS-001245"
                  />
                </div>

              </div>


              {/* ESTACIÓN */}

              <div className="gas-field">

                <label className="gas-label">
                  Estación
                </label>

                <div className="gas-input-wrapper">
                  <FaMapMarkerAlt />

                  <input
                    className="gas-input"
                    type="text"
                    placeholder="Ej. Estación Central"
                  />
                </div>

              </div>


              {/* RESPONSABLE */}

              <div className="gas-field">

                <label className="gas-label">
                  Responsable
                </label>

                <div className="gas-input-wrapper">
                  <FaUser />

                  <input
                    className="gas-input"
                    type="text"
                    placeholder="Nombre del responsable"
                  />
                </div>

              </div>


              {/* LECTURA */}

              <div className="gas-field">

                <label className="gas-label">
                  Lectura actual
                </label>

                <div className="gas-input-wrapper">
                  <FaHashtag />

                  <input
                    className="gas-input"
                    type="number"
                    value={lectura}
                    onChange={(e) => setLectura(e.target.value)}
                    placeholder="Ingresá la lectura"
                  />
                </div>

              </div>


              <button
                className="gas-button"
                onClick={registrarLectura}
              >
                <FaClipboardCheck />
                Registrar lectura
              </button>


              {registrado && (

                <div className="gas-success">
                  <FaCheckCircle />

                  Lectura registrada correctamente
                </div>

              )}

            </div>

          </div>


          {/* DERECHA */}

          <div className="gas-card">

            <div className="gas-card-header">

              <FaFire />

              <div>
                <h2>Información del medidor</h2>

                <span>
                  Datos de la estación
                </span>
              </div>

            </div>


            <div className="gas-card-body">

              <div className="gas-summary">

                <div className="gas-summary-row">

                  <span className="gas-summary-label">
                    Servicio
                  </span>

                  <span className="gas-summary-value">
                    Gas
                  </span>

                </div>


                <div className="gas-summary-row">

                  <span className="gas-summary-label">
                    Tipo de registro
                  </span>

                  <span className="gas-summary-value">
                    Manual
                  </span>

                </div>


                <div className="gas-summary-row">

                  <span className="gas-summary-label">
                    Unidad
                  </span>

                  <span className="gas-summary-value">
                    m³
                  </span>

                </div>


                <div className="gas-summary-row">

                  <span className="gas-summary-label">
                    Estado
                  </span>

                  <span
                    className="gas-summary-value"
                    style={{ color: '#16a34a' }}
                  >
                    Activo
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}