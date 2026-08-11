declare module 'pdfjs-dist/build/pdf.mjs' {
  export function getDocument(params: { data: ArrayBuffer }): { promise: Promise<PDFDocumentProxy> };
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNum: number): Promise<PDFPageProxy>;
    destroy(): Promise<void>;
  }
  export interface PDFPageProxy {
    getViewport(params: { scale: number }): { width: number; height: number };
    render(params: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }): { promise: Promise<void> };
  }
}
