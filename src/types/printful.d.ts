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

interface PrintfulEDM {
  new (options: PrintfulEDMOptions): PrintfulEDM;
  on(event: string, callback: (data?: any) => void): void;
  addImage(image: PrintfulEDMImage): void;
}

interface Window {
  PrintfulEDM: PrintfulEDM;
}