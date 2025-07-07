import { NodeType } from "..//lib/types";

// Función recursiva para recorrer el árbol de nodos
const traverseNodes = (node: SceneNode): { texts: SceneNode[], images: SceneNode[] } => {
  const texts: SceneNode[] = [];
  const images: SceneNode[] = [];

  // Verificar el tipo del nodo actual
  if (node.type === "TEXT") {
    texts.push(node);
  } else if (node.type === "RECTANGLE") {
    images.push(node);
  }

  // Recorrer recursivamente los children si existen
  if ("children" in node && node.children) {
    for (const child of node.children) {
      const childResults = traverseNodes(child);
      texts.push(...childResults.texts);
      images.push(...childResults.images);
    }
  }

  return { texts, images };
};

export const generateACFJSON = async () => {
  if (figma.currentPage.selection.length === 0) {
    console.log("No hay nodos seleccionados");
    return { texts: [], images: [] };
  }

  const selectedNode = figma.currentPage.selection[0];
  console.log("Nodo seleccionado:", selectedNode);

  // Recorrer recursivamente el árbol de nodos
  const result = traverseNodes(selectedNode);

  console.log("Textos encontrados:", result.texts);
  console.log("Imágenes encontradas:", result.images);

  return result;
};

export const extractImages = async () => { };