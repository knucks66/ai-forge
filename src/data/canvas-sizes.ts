export interface CanvasSize {
  id: string;
  name: string;
  width: number;
  height: number;
  aspect: string;
}

export const canvasSizes: CanvasSize[] = [
  { id: 'square', name: 'Square', width: 512, height: 512, aspect: '1:1' },
  { id: 'square-hd', name: 'Square HD', width: 1024, height: 1024, aspect: '1:1' },
  { id: 'portrait', name: 'Portrait', width: 512, height: 768, aspect: '2:3' },
  { id: 'portrait-hd', name: 'Portrait HD', width: 768, height: 1152, aspect: '2:3' },
  { id: 'landscape', name: 'Landscape', width: 768, height: 512, aspect: '3:2' },
  { id: 'landscape-hd', name: 'Landscape HD', width: 1152, height: 768, aspect: '3:2' },
  { id: 'widescreen', name: 'Widescreen', width: 1024, height: 576, aspect: '16:9' },
  { id: 'ultrawide', name: 'Ultrawide', width: 1536, height: 640, aspect: '21:9' },
  { id: 'phone', name: 'Phone', width: 432, height: 768, aspect: '9:16' },
  { id: 'custom', name: 'Custom', width: 512, height: 512, aspect: 'custom' },
];
