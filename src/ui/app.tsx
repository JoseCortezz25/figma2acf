import React, { useState, useEffect } from 'react';
import { NetworkMessages } from '@/common/network/messages';

import { Button } from '@/ui/components/ui/button';
import { Spinner } from '@/ui/components/ui/spinner';

import '@/ui/styles/global.css';

interface SelectionState {
  hasSelection: boolean;
  selectionCount: number;
}

interface ACFResult {
  json: string;
  filename: string;
  fieldsCount: number;
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [selection, setSelection] = useState<SelectionState>({
    hasSelection: false,
    selectionCount: 0
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [acfResult, setACFResult] = useState<ACFResult | null>(null);

  useEffect(() => {
    // Escuchar mensajes del plugin
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data.pluginMessage || {};

      if (type === 'selection-changed') {
        setSelection(payload);
      } else if (type === 'acf-json-generated') {
        setACFResult(payload);
        setIsGenerating(false);
      }
    };

    window.addEventListener('message', handleMessage);
    setLoaded(true);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleGenerateACF = () => {
    setIsGenerating(true);
    setACFResult(null);

    // Enviar mensaje al plugin para generar ACF
    parent.postMessage({
      pluginMessage: {
        type: 'extract-acf',
        payload: {}
      }
    }, '*');
  };

  const handleDownloadJSON = () => {
    if (!acfResult) return;

    const blob = new Blob([acfResult.json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = acfResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = async () => {
    if (!acfResult) return;

    try {
      await navigator.clipboard.writeText(acfResult.json);
      // Aquí podrías mostrar una notificación de éxito
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  if (!loaded) {
    return (
      <div className="size-full flex flex-col items-center justify-center">
        <Spinner size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 w-full h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Figma to ACF
        </h1>
        <p className="text-sm text-gray-600">
          Genera campos ACF desde elementos de Figma
        </p>
      </div>

      {/* Content based on selection */}
      <div className="flex-1 flex flex-col">
        {!selection.hasSelection ? (
          <NoSelectionView />
        ) : acfResult ? (
          <ACFResultView
            result={acfResult}
            onDownload={handleDownloadJSON}
            onCopy={handleCopyJSON}
            onGenerateNew={() => {
              setACFResult(null);
              handleGenerateACF();
            }}
          />
        ) : (
          <SelectionView
            selectionCount={selection.selectionCount}
            onGenerateACF={handleGenerateACF}
            isGenerating={isGenerating}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Selecciona elementos en Figma para empezar
        </p>
      </div>
    </div>
  );
}

function NoSelectionView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-700">
          Sin elementos seleccionados
        </h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Selecciona uno o más elementos en tu diseño de Figma para generar campos ACF automáticamente.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          💡 Consejo
        </h3>
        <p className="text-xs text-blue-600">
          Los textos se convertirán en campos de texto, las imágenes en campos de imagen, y los componentes en campos personalizados.
        </p>
      </div>
    </div>
  );
}

interface ACFResultViewProps {
  result: ACFResult;
  onDownload: () => void;
  onCopy: () => void;
  onGenerateNew: () => void;
}

function ACFResultView({ result, onDownload, onCopy, onGenerateNew }: ACFResultViewProps) {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Success message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">
              ✅ ACF JSON generado exitosamente
            </h3>
            <p className="text-xs text-green-600">
              {result.fieldsCount} campo{result.fieldsCount !== 1 ? 's' : ''} procesado{result.fieldsCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* JSON Preview */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Vista previa del JSON
        </h2>
        <div className="bg-gray-50 border rounded-lg p-4 max-h-64 overflow-auto">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
            {result.json}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onDownload}
            className="flex items-center justify-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Descargar</span>
          </Button>

          <Button
            onClick={onCopy}
            variant="outline"
            className="flex items-center justify-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            <span>Copiar</span>
          </Button>
        </div>

        <Button
          onClick={onGenerateNew}
          variant="outline"
          className="w-full"
        >
          Generar nuevo ACF
        </Button>
      </div>
    </div>
  );
}

interface SelectionViewProps {
  selectionCount: number;
  onGenerateACF: () => void;
  isGenerating: boolean;
}

function SelectionView({ selectionCount, onGenerateACF, isGenerating }: SelectionViewProps) {
  return (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Selection info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">
              Elementos seleccionados
            </h3>
            <p className="text-xs text-green-600">
              {selectionCount} elemento{selectionCount !== 1 ? 's' : ''} list{selectionCount !== 1 ? 'os' : 'o'} para generar ACF
            </p>
          </div>
        </div>
      </div>

      {/* Generation section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Generar ACF JSON
          </h2>
          <p className="text-sm text-gray-600">
            Los elementos seleccionados se convertirán automáticamente en campos ACF compatibles con WordPress.
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Tipos de campo que se generarán:
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <strong>Textos:</strong> Campos de texto/textarea/email/URL</li>
              <li>• <strong>Imágenes:</strong> Campos de imagen</li>
              <li>• <strong>Formas:</strong> Campos de color</li>
              <li>• <strong>Componentes:</strong> Campos personalizados</li>
            </ul>
          </div>

          <Button
            onClick={onGenerateACF}
            disabled={isGenerating}
            className="w-full h-12 text-base font-medium"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <Spinner size={20} />
                <span>Generando ACF JSON...</span>
              </div>
            ) : (
              'Generar ACF JSON'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
