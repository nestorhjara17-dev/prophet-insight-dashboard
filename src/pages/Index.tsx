import { useState } from "react";
import { Car, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { PredictionChart } from "@/components/PredictionChart";
import { MetricsPanel } from "@/components/MetricsPanel";
import { FilterPanel } from "@/components/FilterPanel";
import { toast } from "sonner";

// Mock data para demo - será reemplazado por datos reales del backend
const mockPredictions = [
  { fecha: "2025-01-01", provincia: "CABA", tipo_vehiculo: "Auto", cantidad_real: 1500, cantidad_predicha: 1480 },
  { fecha: "2025-02-01", provincia: "CABA", tipo_vehiculo: "Auto", cantidad_real: 1600, cantidad_predicha: 1620 },
  { fecha: "2025-03-01", provincia: "CABA", tipo_vehiculo: "Auto", cantidad_real: 1700, cantidad_predicha: 1680 },
  { fecha: "2025-01-01", provincia: "Buenos Aires", tipo_vehiculo: "Auto", cantidad_real: 3500, cantidad_predicha: 3450 },
  { fecha: "2025-02-01", provincia: "Buenos Aires", tipo_vehiculo: "Auto", cantidad_real: 3600, cantidad_predicha: 3620 },
  { fecha: "2025-01-01", provincia: "CABA", tipo_vehiculo: "Moto", cantidad_real: 800, cantidad_predicha: 820 },
  { fecha: "2025-02-01", provincia: "CABA", tipo_vehiculo: "Moto", cantidad_real: 850, cantidad_predicha: 830 },
];

const mockMetrics = [
  { provincia: "CABA", tipo_vehiculo: "Auto", MAE: 25.5, RMSE: 32.8, changepoint_prior_scale: 0.1, fourier_order: 15 },
  { provincia: "CABA", tipo_vehiculo: "Moto", MAE: 18.3, RMSE: 24.1, changepoint_prior_scale: 0.05, fourier_order: 10 },
  { provincia: "Buenos Aires", tipo_vehiculo: "Auto", MAE: 45.2, RMSE: 58.6, changepoint_prior_scale: 0.2, fourier_order: 20 },
];

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [predictions, setPredictions] = useState(mockPredictions);
  const [metrics, setMetrics] = useState(mockMetrics);
  const [selectedProvincia, setSelectedProvincia] = useState<string>();
  const [selectedTipo, setSelectedTipo] = useState<string>();

  const provincias = [...new Set(predictions.map(p => p.provincia))];
  const tipos = [...new Set(predictions.map(p => p.tipo_vehiculo))];

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    toast.info("Procesando archivo con Prophet...");

    // Aquí se conectará al backend Python
    // Simulación de procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("¡Análisis completado exitosamente!");
    }, 3000);
  };

  const handleProvinciaChange = (value: string) => {
    setSelectedProvincia(value === "all" ? undefined : value);
  };

  const handleTipoChange = (value: string) => {
    setSelectedTipo(value === "all" ? undefined : value);
  };

  const handleResetFilters = () => {
    setSelectedProvincia(undefined);
    setSelectedTipo(undefined);
  };

  const handleDownloadExcel = () => {
    toast.info("Preparando descarga de Excel...");
    // Aquí se implementará la descarga del archivo Excel generado
  };

  const handleDownloadGraphs = () => {
    toast.info("Preparando descarga de gráficos...");
    // Aquí se implementará la descarga de los gráficos
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center animate-pulse-glow">
                <Car className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Análisis de Predicción de Datos
                </h1>
                <p className="text-sm opacity-90 mt-1">
                  Plataforma avanzada de predicciones con Prophet
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadExcel}
                variant="secondary"
                size="sm"
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
              >
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button
                onClick={handleDownloadGraphs}
                variant="secondary"
                size="sm"
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Gráficos
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <section>
            <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
          </section>

          {/* Dashboard Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters - Sidebar */}
            <aside className="lg:col-span-1">
              <FilterPanel
                provincias={provincias}
                tipos={tipos}
                selectedProvincia={selectedProvincia}
                selectedTipo={selectedTipo}
                onProvinciaChange={handleProvinciaChange}
                onTipoChange={handleTipoChange}
                onReset={handleResetFilters}
              />
            </aside>

            {/* Main Dashboard Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Chart */}
              <PredictionChart
                data={predictions}
                selectedProvincia={selectedProvincia}
                selectedTipo={selectedTipo}
              />

              {/* Metrics */}
              <MetricsPanel
                metrics={metrics}
                selectedProvincia={selectedProvincia}
                selectedTipo={selectedTipo}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              © 2025 Prophet Analytics Dashboard - Powered by Prophet ML
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
              Sistema listo para conectar con backend Python
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
