from ultralytics import YOLO
import cv2

# cargar modelo YOLO
model = YOLO("yolov8n.pt")

# abrir cámara
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    # detectar objetos
    results = model(frame)

    # mostrar resultados
    annotated_frame = results[0].plot()

    cv2.imshow("Deteccion de Medidores", annotated_frame)

    # salir con Q
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()