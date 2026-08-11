export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function calculateSaved(original: number, newSize: number): number {
  if (original === 0) return 0;
  return Math.round(((original - newSize) / original) * 100);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('The image could not be loaded. Try another file.'));
    img.src = src;
  });
}

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('The file could not be read.'));
    reader.readAsDataURL(file);
  });
}

export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('The file could not be read.'));
    reader.readAsArrayBuffer(file);
  });
}

export function validateFile(
  file: File,
  allowedTypes: string[],
  maxMB: number = 100,
): string | null {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const typeBase = file.type.split('/')[0];
  const typeMatch = file.type && allowedTypes.some((t) => file.type === t || t.split('/')[0] === typeBase);
  const extMatch = allowedTypes.some((t) => t.split('/')[1] === ext || t === ext);

  if (!typeMatch && !extMatch) {
    return 'That file format isn\'t supported yet.';
  }
  if (file.size > maxMB * 1024 * 1024) {
    return `That file is too large. The maximum is ${maxMB} MB.`;
  }
  return null;
}

export function getBaseName(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}
