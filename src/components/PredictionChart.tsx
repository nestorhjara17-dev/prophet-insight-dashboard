import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface PredictionData {
  fecha: string;
  provincia: string;
  tipo_vehiculo: string;
  cantidad_real: number;
  cantidad_predicha: number;
}

interface PredictionChartProps {
  data: PredictionData[];
  selectedProvincia?: string;
  selectedTipo?: string;
}

export const PredictionChart = ({ data, selectedProvincia, selectedTipo }: PredictionChartProps) => {
  const filteredData = data.filter((item) => {
    if (selectedProvincia && item.provincia !== selectedProvincia) return false;
    if (selectedTipo && item.tipo_vehiculo !== selectedTipo) return false;
    return true;
  });

  const chartData = filteredData.map((item) => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }),
    Real: item.cantidad_real,
    Predicción: Math.round(item.cantidad_predicha),
  }));

  if (filteredData.length === 0) {
    return (
      <Card className="p-8 bg-gradient-card border-border/50 shadow-md">
        <div className="text-center text-muted-foreground">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No hay datos disponibles para los filtros seleccionados</p>
          <p className="text-sm mt-2">Intenta ajustar los filtros o carga un archivo CSV</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-md animate-fade-in">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Predicciones vs Valores Reales (2025)
        </h3>
        {selectedProvincia && (
          <p className="text-sm text-muted-foreground mt-1">
            {selectedProvincia} {selectedTipo && `- ${selectedTipo}`}
          </p>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="fecha" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-md)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="Real"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Predicción"
            stroke="hsl(var(--accent))"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: 'hsl(var(--accent))', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
