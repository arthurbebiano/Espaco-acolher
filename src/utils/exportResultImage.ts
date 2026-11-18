import { toPng } from 'html-to-image';

export async function generateResultPngDataUrl(
  node: HTMLElement
): Promise<string> {
  const width = node.offsetWidth;
  const height = node.offsetHeight;

  const options = {
    width,
    height,
    pixelRatio: 2.5,
    backgroundColor: '#FAF9F6',
    cacheBust: true,
    style: {
      margin: '0',
      width: `${width}px`,
      height: `${height}px`,
    },
  };

  try {
    return await toPng(node, options);
  } catch {
    // Fallback if external stylesheet rules block cross-origin font inlining
    return await toPng(node, {
      ...options,
      skipFonts: true,
    });
  }
}

export function triggerPngDownload(
  dataUrl: string,
  filename = 'panorama-bem-estar-emocional.png'
): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
