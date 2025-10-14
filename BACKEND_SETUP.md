# 🚀 Guía de Conexión con Backend Python

Esta interfaz está **lista para conectarse a tu código Prophet exacto** (sin modificaciones). Sigue estos pasos para implementar el backend.

## 📋 Opciones de Hosting para tu Código Python

### Opción 1: Railway (Recomendado - Gratis para empezar)
1. Crea una cuenta en [Railway.app](https://railway.app)
2. Conecta tu repositorio GitHub con el código Python
3. Railway detectará automáticamente requirements.txt y lo instalará
4. Obtendrás una URL como: `https://tu-app.railway.app`

### Opción 2: Render
1. Crea una cuenta en [Render.com](https://render.com)
2. Crea un "Web Service" desde tu repositorio
3. Configura: Python 3, comando `python app.py`
4. URL final: `https://tu-app.onrender.com`

### Opción 3: PythonAnywhere
1. Cuenta en [PythonAnywhere.com](https://www.pythonanywhere.com)
2. Sube tu código Prophet
3. Configura una Flask/FastAPI app
4. URL: `https://tu-usuario.pythonanywhere.com`

---

## 🔌 Estructura del Backend Python Requerida

Crea un archivo `app.py` con Flask o FastAPI que **use tu código Prophet exacto**:

### Ejemplo con FastAPI (Recomendado):

```python
from fastapi import FastAPI, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
import io
import os

app = FastAPI()

# CORS para permitir conexión desde tu frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, reemplaza con tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variable global para almacenar resultados
resultados_cache = {
    "predictions": None,
    "metrics": None,
    "status": "idle"  # idle, processing, completed, error
}


@app.get("/")
def read_root():
    return {"message": "Prophet API funcionando", "status": "ok"}


@app.post("/upload-csv")
async def upload_csv(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Endpoint para subir CSV y procesar con Prophet
    """
    if not file.filename.endswith('.csv'):
        return {"error": "El archivo debe ser CSV"}, 400
    
    # Leer el CSV
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    
    # Guardar temporalmente
    df.to_csv("DNRPA.csv", index=False)
    
    # Iniciar procesamiento en segundo plano
    background_tasks.add_task(procesar_prophet)
    
    resultados_cache["status"] = "processing"
    
    return {
        "message": "CSV recibido, procesando con Prophet...",
        "filename": file.filename,
        "rows": len(df),
        "status": "processing"
    }


def procesar_prophet():
    """
    AQUÍ VA TU CÓDIGO PROPHET EXACTO
    Solo necesitas adaptar el final para guardar en resultados_cache
    """
    global resultados_cache
    
    try:
        # ========================================
        # TU CÓDIGO PROPHET COMPLETO VA AQUÍ
        # (imports, lecturas, Prophet, etc.)
        # ========================================
        
        # Imports necesarios
        import pandas as pd
        from prophet import Prophet
        from sklearn.metrics import mean_absolute_error, mean_squared_error
        import numpy as np
        # ... resto de imports
        
        # Todo tu código Prophet...
        # df = pd.read_csv("DNRPA.csv")
        # ... grid search, entrenamiento, predicciones...
        
        # Al final, en lugar de guardar Excel, guardas en cache:
        resultados_cache["predictions"] = df_resultados.to_dict('records')
        resultados_cache["metrics"] = df_metricas.to_dict('records')
        resultados_cache["status"] = "completed"
        
        # Opcionalmente, guarda el Excel también
        with pd.ExcelWriter("predict_metric_prophet.xlsx") as writer:
            df_resultados.to_excel(writer, sheet_name="Predicciones", index=False)
            df_metricas.to_excel(writer, sheet_name="Metricas", index=False)
        
        print("✅ Procesamiento Prophet completado")
        
    except Exception as e:
        print(f"❌ Error en Prophet: {e}")
        resultados_cache["status"] = "error"
        resultados_cache["error"] = str(e)


@app.get("/status")
def get_status():
    """
    Endpoint para verificar el estado del procesamiento
    """
    return {
        "status": resultados_cache["status"],
        "has_data": resultados_cache["predictions"] is not None
    }


@app.get("/predictions")
def get_predictions():
    """
    Endpoint para obtener las predicciones
    """
    if resultados_cache["status"] != "completed":
        return {"error": "Procesamiento no completado aún"}, 400
    
    return {
        "predictions": resultados_cache["predictions"],
        "status": "ok"
    }


@app.get("/metrics")
def get_metrics():
    """
    Endpoint para obtener las métricas
    """
    if resultados_cache["status"] != "completed":
        return {"error": "Procesamiento no completado aún"}, 400
    
    return {
        "metrics": resultados_cache["metrics"],
        "status": "ok"
    }


@app.get("/download-excel")
def download_excel():
    """
    Endpoint para descargar el archivo Excel generado
    """
    file_path = "predict_metric_prophet.xlsx"
    if not os.path.exists(file_path):
        return {"error": "Archivo Excel no encontrado"}, 404
    
    return FileResponse(
        file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="predict_metric_prophet.xlsx"
    )


@app.get("/graphs")
def list_graphs():
    """
    Endpoint para listar los gráficos generados
    """
    graphs_dir = "graficos_predicciones"
    if not os.path.exists(graphs_dir):
        return {"graphs": []}
    
    graphs = [f for f in os.listdir(graphs_dir) if f.endswith('.png')]
    return {"graphs": graphs}


@app.get("/graphs/{filename}")
def download_graph(filename: str):
    """
    Endpoint para descargar un gráfico específico
    """
    file_path = f"graficos_predicciones/{filename}"
    if not os.path.exists(file_path):
        return {"error": "Gráfico no encontrado"}, 404
    
    return FileResponse(file_path, media_type="image/png")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### requirements.txt:
```
fastapi
uvicorn
pandas
prophet
scikit-learn
numpy
matplotlib
openpyxl
python-multipart
```

---

## 🔗 Conectar el Frontend al Backend

Una vez que tu backend esté desplegado, actualiza el archivo `src/pages/Index.tsx`:

```typescript
// En la parte superior del archivo, agrega:
const API_URL = "https://tu-backend.railway.app"; // Reemplaza con tu URL

// Actualiza la función handleFileUpload:
const handleFileUpload = async (file: File) => {
  setIsProcessing(true);
  toast.info("Subiendo archivo...");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload-csv`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Error al subir archivo");

    toast.success("Archivo subido. Procesando con Prophet...");
    
    // Polling para verificar estado
    const checkStatus = async () => {
      const statusRes = await fetch(`${API_URL}/status`);
      const statusData = await statusRes.json();
      
      if (statusData.status === "completed") {
        // Cargar predicciones y métricas
        const predRes = await fetch(`${API_URL}/predictions`);
        const predData = await predRes.json();
        setPredictions(predData.predictions);
        
        const metricRes = await fetch(`${API_URL}/metrics`);
        const metricData = await metricRes.json();
        setMetrics(metricData.metrics);
        
        setIsProcessing(false);
        toast.success("¡Análisis completado!");
      } else if (statusData.status === "error") {
        setIsProcessing(false);
        toast.error("Error en el procesamiento");
      } else {
        setTimeout(checkStatus, 2000); // Verificar cada 2 segundos
      }
    };
    
    checkStatus();
    
  } catch (error) {
    console.error(error);
    setIsProcessing(false);
    toast.error("Error al procesar el archivo");
  }
};

// Actualiza handleDownloadExcel:
const handleDownloadExcel = async () => {
  try {
    const response = await fetch(`${API_URL}/download-excel`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'predict_metric_prophet.xlsx';
    a.click();
    toast.success("Excel descargado");
  } catch (error) {
    toast.error("Error al descargar Excel");
  }
};
```

---

## 🎯 Resumen de Pasos

1. ✅ **Frontend YA ESTÁ LISTO** (esta interfaz)
2. 📦 Copia tu código Prophet en `app.py` siguiendo la estructura de arriba
3. 🚀 Sube a Railway/Render/PythonAnywhere
4. 🔗 Copia la URL del backend
5. ⚙️ Actualiza `API_URL` en `src/pages/Index.tsx`
6. 🎉 ¡Funciona!

---

## 📞 Soporte

Si tienes dudas sobre la conexión:
- Verifica que el backend esté corriendo: `https://tu-backend.com/`
- Revisa los logs en Railway/Render
- Asegúrate de que CORS esté habilitado
- Verifica que las rutas coincidan

**Tu código Prophet NO necesita cambios en su lógica**, solo necesitas envolverlo en los endpoints de FastAPI.
