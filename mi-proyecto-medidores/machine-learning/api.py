from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.linear_model import LinearRegression
from supabase import create_client
from dotenv import load_dotenv
import numpy as np
import os

# Cargar variables del archivo .env
load_dotenv()

# DATOS DE SUPABASE
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Conexión a Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Crear API
app = FastAPI()

# Modelo de datos
class Datos(BaseModel):
    futuro: int

# Ruta principal
@app.get("/")
def inicio():
    return {"mensaje": "ML conectado a Supabase"}

# Predicción de consumo
@app.post("/predict")
def predecir(datos: Datos):

    # Obtener datos de la tabla lecturas
    response = supabase.table("lecturas").select("*").execute()

    registros = response.data

    meses = []
    consumos = []

    contador = 1

    # Recorrer registros
    for r in registros:

        lectura = r["valor_lectura"]

        if lectura is not None:
            meses.append([contador])
            consumos.append(float(lectura))
            contador += 1

    # Verificar si existen datos
    if len(consumos) == 0:
        return {
            "error": "No existen lecturas en la base de datos"
        }

    # Convertir a arrays
    X = np.array(meses)
    y = np.array(consumos)

    # Crear y entrenar modelo
    modelo = LinearRegression()
    modelo.fit(X, y)

    # Predicción
    prediccion = modelo.predict([[datos.futuro]])

    return {
        "mes_futuro": datos.futuro,
        "prediccion_consumo": round(float(prediccion[0]), 2),
        "lecturas_analizadas": len(consumos)
    }