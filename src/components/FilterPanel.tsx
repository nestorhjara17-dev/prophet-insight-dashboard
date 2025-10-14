import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  provincias: string[];
  tipos: string[];
  selectedProvincia?: string;
  selectedTipo?: string;
  onProvinciaChange: (value: string) => void;
  onTipoChange: (value: string) => void;
  onReset: () => void;
}

export const FilterPanel = ({
  provincias,
  tipos,
  selectedProvincia,
  selectedTipo,
  onProvinciaChange,
  onTipoChange,
  onReset,
}: FilterPanelProps) => {
  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-md animate-slide-up">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filtros
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provincia" className="text-sm font-medium text-foreground">
              Provincia
            </Label>
            <Select value={selectedProvincia || "all"} onValueChange={onProvinciaChange}>
              <SelectTrigger 
                id="provincia" 
                className="bg-background border-border hover:border-primary/50 transition-colors"
              >
                <SelectValue placeholder="Todas las provincias" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border max-h-[300px]">
                <SelectItem value="all">Todas las provincias</SelectItem>
                {provincias.map((provincia) => (
                  <SelectItem key={provincia} value={provincia}>
                    {provincia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-sm font-medium text-foreground">
              Tipo de Vehículo
            </Label>
            <Select value={selectedTipo || "all"} onValueChange={onTipoChange}>
              <SelectTrigger 
                id="tipo"
                className="bg-background border-border hover:border-primary/50 transition-colors"
              >
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Todos los tipos</SelectItem>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {(selectedProvincia || selectedTipo) && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Filtros activos:{" "}
              <span className="font-medium text-foreground">
                {[selectedProvincia, selectedTipo].filter(Boolean).join(", ")}
              </span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
