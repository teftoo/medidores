from sklearn.linear_model import LinearRegression
import numpy as np

# Datos históricos de consumo
meses = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
consumo = np.array([10, 12, 15, 18, 20])

# Crear modelo
modelo = LinearRegression()

# Entrenar modelo
modelo.fit(meses, consumo)

# Predecir siguiente mes
prediccion = modelo.predict([[6]])

print("Predicción del próximo mes:")
print(round(prediccion[0], 2), "m³")