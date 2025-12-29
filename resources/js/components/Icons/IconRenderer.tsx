import React from 'react';

interface IconRendererProps {
  srcOrComponent: any;
  width?: number | string;
  height?: number | string;
  [key: string]: any;
}

export default function IconRenderer({ srcOrComponent, width, height, ...props }: IconRendererProps) {
  if (!srcOrComponent) return null;

  if (typeof srcOrComponent === 'string') {
    return <img src={srcOrComponent} width={width} height={height} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />;
  }

  const SVGComponent = srcOrComponent as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  return <SVGComponent width={width} height={height} {...(props as React.SVGProps<SVGSVGElement>)} />;
}
