interface PrintfulEDMOptions {
  elementId: string;
  productId: number;
  customization?: {
    theme?: {
      primary_color?: string;
      secondary_color?: string;
    };
    hide_elements?: string[];
  };
}

interface PrintfulEDMImage {
  type: 'url';
  url: string;
  name?: string;
}

interface PrintfulEDMDesign {
  id: string;
  preview_url: string;
  files: PrintfulEDMImage[];
}

interface PrintfulEDM {
  new (options: PrintfulEDMOptions): PrintfulEDM;
  on(event: 'editor.loaded' | 'editor.error' | 'design.save', callback: (data?: any) => void): void;
  addImage(image: PrintfulEDMImage): void;
  getDesign(): Promise<PrintfulEDMDesign>;
}

interface Window {
  PrintfulEDM: PrintfulEDM;
}