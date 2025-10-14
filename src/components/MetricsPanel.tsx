import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Settings, CheckCircle } from "lucide-react";

interface Metric {
  provincia: string;
  tipo_vehiculo: string;
  MAE: number;
  RMSE: number;
  changepoint_prior_scale: number;
  fourier_order: number;
}

interface MetricsPanelProps {
  metrics: Metric[];
  selectedProvincia?: string;
  selectedTipo?: string;
}

export const MetricsPanel = ({ metrics, selectedProvincia, selectedTipo }: MetricsPanelProps) => {
  const filteredMetrics = metrics.filter((m) => {
    if (selectedProvincia && m.provincia !== selectedProvincia) return false;
    if (selectedTipo && m.tipo_vehiculo !== selectedTipo) return false;
    return true;
  });

  const avgMAE = filteredMetrics.length > 0
    ? filteredMetrics.reduce((sum, m) => sum + m.MAE, 0) / filteredMetrics.length
    : 0;

  const avgRMSE = filteredMetrics.length > 0
    ? filteredMetrics.reduce((sum, m) => sum + m.RMSE, 0) / filteredMetrics.length
    : 0;

  const bestModel = filteredMetrics.length > 0
    ? filteredMetrics.reduce((best, current) => current.MAE < best.MAE ? current : best)
    : null;

  return (
    <div className="space-y-4 animate-slide-up">
      <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        <Target className="w-6 h-6 text-primary" />
        Métricas de Precisión
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-card border-border/50 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">MAE Promedio</p>
              <p className="text-3xl font-bold text-foreground">{avgMAE.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Error Absoluto Medio</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">RMSE Promedio</p>
              <p className="text-3xl font-bold text-foreground">{avgRMSE.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Raíz del Error Cuadrático Medio</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>
      </div>

      {bestModel && (
        <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Mejor Modelo</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="opacity-90">Provincia</p>
                <p className="font-semibold text-base">{bestModel.provincia}</p>
              </div>
              <div>
                <p className="opacity-90">Tipo</p>
                <p className="font-semibold text-base">{bestModel.tipo_vehiculo}</p>
              </div>
              <div>
                <p className="opacity-90">MAE</p>
                <p className="font-semibold text-base">{bestModel.MAE.toFixed(2)}</p>
              </div>
              <div>
                <p className="opacity-90">RMSE</p>
                <p className="font-semibold text-base">{bestModel.RMSE.toFixed(2)}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-primary-foreground/20">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4" />
                <p className="text-sm font-medium">Parámetros Óptimos</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="opacity-90">Changepoint Prior Scale</p>
                  <p className="font-mono font-semibold">{bestModel.changepoint_prior_scale}</p>
                </div>
                <div>
                  <p className="opacity-90">Fourier Order</p>
                  <p className="font-mono font-semibold">{bestModel.fourier_order}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {filteredMetrics.length > 0 && (
        <Card className="p-6 bg-card border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-4">Todos los Modelos</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMetrics.map((metric, index) => (
              <div
                key={index}
                className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{metric.provincia}</p>
                    <p className="text-sm text-muted-foreground">{metric.tipo_vehiculo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">MAE: <span className="font-semibold text-foreground">{metric.MAE.toFixed(2)}</span></p>
                    <p className="text-sm text-muted-foreground">RMSE: <span className="font-semibold text-foreground">{metric.RMSE.toFixed(2)}</span></p>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>CPS: {metric.changepoint_prior_scale}</span>
                  <span>FO: {metric.fourier_order}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
