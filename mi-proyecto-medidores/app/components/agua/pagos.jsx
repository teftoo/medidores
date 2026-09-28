'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaMoneyBillWave, FaQrcode, FaCreditCard, FaUniversity,
  FaCheckCircle, FaHourglassHalf, FaInfoCircle, FaLock, FaShieldAlt
} from 'react-icons/fa'
import QRCode from 'qrcode'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  .p-root {
    --white:     #ffffff;
    --off:       #f9f9f8;
    --border:    #ebebea;
    --border-md: #d4d4d0;
    --ink:       #111110;
    --ink-2:     #3a3a38;
    --ink-3:     #737370;
    --ink-4:     #b0b0ac;
    --teal:      #0ea5b8;
    --teal-dk:   #0b7a8a;
    --teal-bg:   #e3f6fb;
    --teal-bd:   #a8e0ea;
    --indigo:    #4f46e5;
    --indigo-bg: #eef0fd;
    --indigo-bd: #c7c3f7;
    --amber:     #d97706;
    --amber-bg:  #fffbeb;
    --amber-bd:  #fde68a;
    --red:       #dc2626;
    --red-bg:    #fef2f2;
    --red-bd:    #fecaca;
    --green:     #16a34a;
    --green-bg:  #f0fdf4;
    --green-bd:  #bbf7d0;
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--ink);
    padding: 0;
  }

  .p-header {
    display: flex; align-items: center; gap: 16px;
    padding-bottom: 24px; border-bottom: 1.5px solid var(--border); margin-bottom: 28px;
  }
  .p-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--ink); display: flex; align-items: center;
    justify-content: center; color: var(--teal); flex-shrink: 0;
  }
  .p-title {
    font-family: 'Inter', sans-serif; font-weight: 800; font-size: 28px;
    color: var(--ink); letter-spacing: -.02em; line-height: 1.1;
  }
  .p-subtitle { font-size: 13px; color: var(--ink-3); margin-top: 4px; }

  .p-aviso {
    background: var(--amber-bg); border: 1.5px solid var(--amber-bd);
    border-radius: 12px; padding: 12px 18px;
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: var(--amber); margin-bottom: 24px;
  }

  .p-metodos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .p-metodo {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 24px 20px; text-align: center;
    cursor: pointer; transition: all .2s;
  }
  .p-metodo:hover { border-color: var(--border-md); transform: translateY(-3px); }
  .p-metodo.sel { border-color: var(--teal); background: var(--teal-bg); }
  .p-metodo-icon {
    width: 56px; height: 56px; border-radius: 16px; background: var(--ink);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px; color: var(--teal); font-size: 24px;
    transition: all .2s;
  }
  .p-metodo.sel .p-metodo-icon { background: var(--teal); color: #fff; }
  .p-metodo-title { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 15px; color: var(--ink); margin-bottom: 4px; }
  .p-metodo-sub { font-size: 12px; color: var(--ink-3); }

  .p-detalle {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 24px;
  }
  .p-detalle-title {
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 15px;
    color: var(--ink); margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }

  /* QR */
  .p-qr-box {
    background: var(--off); border: 1.5px solid var(--border);
    border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 16px;
  }
  .p-qr-img { width: 160px; height: 160px; border-radius: 12px; border: 4px solid var(--white); margin: 0 auto 14px; display: block; }
  .p-qr-lbl { font-size: 12px; color: var(--ink-3); margin-bottom: 4px; }
  .p-qr-apps { display: flex; gap: 8px; justify-content: center; margin-top: 14px; flex-wrap: wrap; }
  .p-qr-app {
    padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 500;
    background: var(--teal-bg); color: var(--teal-dk); border: 1px solid var(--teal-bd);
  }

  /* TARJETA */
  .p-form { display: flex; flex-direction: column; gap: 16px; }
  .p-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .p-field label {
    display: block; font-size: 11px; font-weight: 600;
    color: var(--ink-3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px;
  }
  .p-field input {
    width: 100%; height: 42px; border: 1.5px solid var(--border);
    border-radius: 10px; padding: 0 14px;
    font-family: 'Inter', sans-serif; font-size: 13px; color: var(--ink);
    background: var(--white); outline: none; transition: border-color .15s;
  }
  .p-field input:focus { border-color: var(--teal); }
  .p-pay-btn {
    width: 100%; padding: 14px; border-radius: 12px; border: none;
    background: var(--teal); color: #fff;
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 15px;
    cursor: pointer; margin-top: 4px; transition: background .15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .p-pay-btn:hover { background: var(--teal-dk); }
  .p-pay-btn:disabled { opacity: .6; cursor: not-allowed; }
  .p-ssl { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 11px; color: var(--ink-4); margin-top: 10px; }

  /* EFECTIVO */
  .p-bancos { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .p-banco {
    background: var(--off); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .p-banco-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--indigo-bg); display: flex; align-items: center;
    justify-content: center; color: var(--indigo); font-size: 16px; flex-shrink: 0;
  }
  .p-banco-name { font-size: 13px; font-weight: 600; color: var(--ink-2); }
  .p-banco-hours { font-size: 11px; color: var(--ink-4); margin-top: 2px; }

  .p-tips-title {
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px;
    color: var(--ink); margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .p-tip {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid var(--border);
    font-size: 13px; color: var(--ink-2); line-height: 1.55;
  }
  .p-tip:last-child { border-bottom: none; padding-bottom: 0; }
  .p-tip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); flex-shrink: 0; margin-top: 6px; }

  /* CONFIRMACIÓN */
  .p-confirm {
    background: var(--teal-bg); border: 1.5px solid var(--teal-bd);
    border-radius: 16px; padding: 28px; text-align: center;
  }
  .p-confirm-icon {
    width: 60px; height: 60px; border-radius: 50%; background: var(--teal);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 28px; margin: 0 auto 14px;
  }
  .p-confirm-t { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 22px; color: var(--teal-dk); margin-bottom: 6px; }
  .p-confirm-s { font-size: 13px; color: var(--teal-dk); opacity: .7; }
  .p-confirm-demo { font-size: 11px; color: var(--ink-4); margin-top: 8px; }

  .p-reset-btn {
    margin-top: 16px; padding: 10px 24px; border-radius: 10px;
    border: 1.5px solid var(--teal-bd); background: var(--white);
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--teal-dk); cursor: pointer; transition: all .15s;
  }
  .p-reset-btn:hover { background: var(--teal-bg); }

  @media (max-width: 640px) {
    .p-metodos { grid-template-columns: 1fr; }
    .p-bancos { grid-template-columns: 1fr; }
    .p-form-row { grid-template-columns: 1fr; }
  }
`

const BANCOS = [
  { nombre: 'Banco Nacional de Bolivia', horario: 'Todas las sucursales' },
  { nombre: 'Banco Unión',               horario: 'Lunes–Viernes 8:30–16:00' },
  { nombre: 'Banco Mercantil Santa Cruz', horario: 'Con código de servicio' },
  { nombre: 'Banco FIE',                  horario: 'Agencias habilitadas' },
]

export default function Pagos() {
  const [metodo,     setMetodo]     = useState('ef')
  const [qrDataUrl,  setQrDataUrl]  = useState('')
  const [procesando, setProcesando] = useState(false)
  const [pagado,     setPagado]     = useState(false)
  const [tarjeta,    setTarjeta]    = useState({ numero: '', vencimiento: '', cvv: '', titular: '' })

  const handleSelMetodo = async (tipo) => {
    setMetodo(tipo); setPagado(false)
    if (tipo === 'qr' && !qrDataUrl) {
      try {
        const url = await QRCode.toDataURL('https://acs.gob.bo/consultar-consumo')
        setQrDataUrl(url)
      } catch (e) { console.error(e) }
    }
  }

  const handlePago = async () => {
    setProcesando(true)
    await new Promise(r => setTimeout(r, 2000))
    setProcesando(false); setPagado(true)
  }

  return (
    <div className="p-root">
      <style>{css}</style>

      {/* HEADER */}
      <div className="p-header">
        <div className="p-header-icon"><FaMoneyBillWave size={22} /></div>
        <div>
          <div className="p-title">Métodos de pago</div>
          <div className="p-subtitle">Seleccioná cómo querés abonar tu factura · Administración de Consumo por Sector Cochabamba</div>
        </div>
      </div>

      {/* AVISO DEMO */}
      <div className="p-aviso">
        <FaInfoCircle />
        Modo demostración — la pasarela de pago real estará disponible próximamente.
      </div>

      {/* MÉTODOS */}
      <div className="p-metodos">
        {[
          { id: 'qr',  icon: <FaQrcode />,      title: 'Código QR',  sub: 'Escanea con cualquier app de pago' },
          { id: 'tar', icon: <FaCreditCard />,   title: 'Tarjeta',    sub: 'Débito o crédito, pago seguro'    },
          { id: 'ef',  icon: <FaUniversity />,   title: 'Efectivo',   sub: 'En bancos y puntos autorizados'   },
        ].map(m => (
          <div key={m.id} className={`p-metodo${metodo === m.id ? ' sel' : ''}`} onClick={() => handleSelMetodo(m.id)}>
            <div className="p-metodo-icon">{m.icon}</div>
            <div className="p-metodo-title">{m.title}</div>
            <div className="p-metodo-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* DETALLE */}
      {!pagado ? (
        <div className="p-detalle">

          {/* QR */}
          {metodo === 'qr' && (
            <>
              <div className="p-detalle-title"><FaQrcode style={{ color: 'var(--teal)' }} /> Escanea para pagar</div>
              <div className="p-qr-box">
                {qrDataUrl
                  ? <img src={qrDataUrl} alt="Código QR de pago" className="p-qr-img" />
                  : <div style={{ width: 160, height: 160, borderRadius: 12, background: 'var(--border)', margin: '0 auto 14px' }} />
                }
                <div className="p-qr-lbl">Válido por 15 minutos</div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>El monto se carga automáticamente</div>
                <div className="p-qr-apps">
                  {['Tigo Money', 'BNB App', 'Bancosol', 'SimpleQR'].map(a => (
                    <span key={a} className="p-qr-app">{a}</span>
                  ))}
                </div>
              </div>
              <div className="p-tips-title" style={{ fontSize: 13, marginBottom: 10 }}><FaInfoCircle style={{ color: 'var(--teal)' }} /> Cómo pagar con QR</div>
              {[
                'Abrí tu app bancaria o de pagos y buscá "Pagar con QR".',
                'Apuntá la cámara al código — el monto se carga solo.',
                'Confirmá el pago y guardá el comprobante.',
              ].map((t, i) => <div key={i} className="p-tip"><div className="p-tip-dot" />{t}</div>)}
            </>
          )}

          {/* TARJETA */}
          {metodo === 'tar' && (
            <>
              <div className="p-detalle-title"><FaCreditCard style={{ color: 'var(--teal)' }} /> Datos de tarjeta</div>
              <div className="p-form">
                <div className="p-field">
                  <label>Número de tarjeta</label>
                  <input type="text" placeholder="0000 0000 0000 0000" maxLength={19}
                    value={tarjeta.numero}
                    onChange={e => setTarjeta({ ...tarjeta, numero: e.target.value })} />
                </div>
                <div className="p-form-row">
                  <div className="p-field">
                    <label>Vencimiento</label>
                    <input type="text" placeholder="MM/AA" maxLength={5}
                      value={tarjeta.vencimiento}
                      onChange={e => setTarjeta({ ...tarjeta, vencimiento: e.target.value })} />
                  </div>
                  <div className="p-field">
                    <label>CVV</label>
                    <input type="text" placeholder="000" maxLength={4}
                      value={tarjeta.cvv}
                      onChange={e => setTarjeta({ ...tarjeta, cvv: e.target.value })} />
                  </div>
                </div>
                <div className="p-field">
                  <label>Titular</label>
                  <input type="text" placeholder="Nombre como aparece en la tarjeta"
                    value={tarjeta.titular}
                    onChange={e => setTarjeta({ ...tarjeta, titular: e.target.value })} />
                </div>
              </div>
              <button className="p-pay-btn" onClick={handlePago} disabled={procesando}>
                {procesando ? <><FaHourglassHalf style={{ animation: 'spin .65s linear infinite' }} /> Procesando...</> : <><FaLock /> Pagar Bs 67.50</>}
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </button>
              <div className="p-ssl"><FaShieldAlt /> Conexión segura SSL — tus datos están protegidos</div>
            </>
          )}

          {/* EFECTIVO */}
          {metodo === 'ef' && (
            <>
              <div className="p-detalle-title"><FaUniversity style={{ color: 'var(--teal)' }} /> Bancos y puntos autorizados</div>
              <div className="p-bancos">
                {BANCOS.map((b, i) => (
                  <div key={i} className="p-banco">
                    <div className="p-banco-icon"><FaUniversity /></div>
                    <div>
                      <div className="p-banco-name">{b.nombre}</div>
                      <div className="p-banco-hours">{b.horario}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-tips-title"><FaInfoCircle style={{ color: 'var(--teal)' }} /> Instrucciones para pago en efectivo</div>
              {[
                'Presentá tu código de cliente (SEM-XXXXXX) en la caja del banco.',
                'Pedí el comprobante sellado — es tu respaldo ante cualquier reclamo.',
                'Pagá antes de la fecha de vencimiento para evitar recargos por mora.',
                'El pago puede demorar hasta 24 horas hábiles en reflejarse en el sistema.',
              ].map((t, i) => <div key={i} className="p-tip"><div className="p-tip-dot" />{t}</div>)}
            </>
          )}
        </div>
      ) : (
        <motion.div className="p-confirm" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="p-confirm-icon"><FaCheckCircle /></div>
          <div className="p-confirm-t">¡Pago confirmado!</div>
          <div className="p-confirm-s">
            {metodo === 'qr'  && 'El pago mediante QR fue procesado correctamente.'}
            {metodo === 'tar' && 'Tu tarjeta fue procesada. Recibirás un comprobante por correo.'}
            {metodo === 'ef'  && 'Presentate en el banco con tu código de cliente.'}
          </div>
          <div className="p-confirm-demo">(Simulación — no se procesó un pago real)</div>
          <button className="p-reset-btn" onClick={() => setPagado(false)}>Realizar otro pago</button>
        </motion.div>
      )}
    </div>
  )
}

