import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload = ({ onFileUpload, isProcessing }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error("Por favor, selecciona un archivo CSV válido");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("El archivo es demasiado grande. Máximo 10MB");
      return;
    }

    setSelectedFile(file);
    toast.success(`Archivo "${file.name}" seleccionado correctamente`);
  };

  const handleProcess = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Card className="p-8 bg-gradient-card border-border/50 shadow-md animate-fade-in">
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 transition-all ${
          dragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
          disabled={isProcessing}
        />

        {!selectedFile ? (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                Arrastra tu archivo CSV aquí
              </p>
              <p className="text-sm text-muted-foreground">
                o haz clic para seleccionar desde tu dispositivo
              </p>
            </div>
            <Button
              onClick={() => inputRef.current?.click()}
              disabled={isProcessing}
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all"
            >
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Seleccionar Archivo CSV
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Formato esperado: DNRPA.csv (máx. 10MB)
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4 animate-scale-in">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <FileSpreadsheet className="w-8 h-8 text-success" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleProcess}
                disabled={isProcessing}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all"
              >
                {isProcessing ? "Procesando..." : "Analizar con Prophet"}
              </Button>
              <Button
                onClick={handleRemove}
                disabled={isProcessing}
                variant="outline"
                size="lg"
              >
                <X className="w-5 h-5 mr-2" />
                Remover
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
