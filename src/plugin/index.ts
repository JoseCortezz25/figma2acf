import { initializeNetwork } from '@/common/network/init';
import { NetworkSide } from '@/common/network/sides';
import { PluginMessageType } from '../lib/types';
import { generateACFJSON } from './router';

async function initializePlugin() {
  initializeNetwork(NetworkSide.PLUGIN);

  figma.showUI(__html__, {
    width: 400,
    height: 600,
    title: 'Figma to ACF Generator',
  });

  // Enviar selección inicial a la UI
  figma.ui.postMessage({
    type: 'selection-changed',
    payload: {
      hasSelection: figma.currentPage.selection.length > 0,
      selectionCount: figma.currentPage.selection.length
    }
  });

  // Escuchar cambios de selección
  figma.on('selectionchange', () => {
    figma.ui.postMessage({
      type: 'selection-changed',
      payload: {
        hasSelection: figma.currentPage.selection.length > 0,
        selectionCount: figma.currentPage.selection.length
      }
    });
  });

  figma.ui.onmessage = async (event) => {
    console.log(event);
    const { type, payload } = event;

    switch (type) {
      case PluginMessageType.EXTRACT_TO_ACF:
        console.log('Generando ACF JSON...');
        const result = await generateACFJSON();
        if (result) {
          figma.notify('✅ ACF JSON generado correctamente');
        } else {
          figma.notify('❌ Error al generar ACF JSON');
        }

        figma.ui.postMessage({
          type: PluginMessageType.EXTRACT_TO_ACF,
          loading: PluginMessageType.LOADED,
          payload: result
        });
        break;
    }
  };
}

initializePlugin();
