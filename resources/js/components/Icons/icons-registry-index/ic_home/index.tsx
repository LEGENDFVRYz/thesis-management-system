import React from 'react';
import { registry, Variant } from './registry';
import IconRenderer from '../../IconRenderer';

interface Props extends React.SVGProps<SVGSVGElement> {
  variant?: Variant;
  width?: number | string;
  height?: number | string;
}

export default function IconComponent({ variant = 'default', width = 24, height = 24, ...props }: Props) {
  const source = registry[variant];
  if (!source) return null;
  return <IconRenderer srcOrComponent={source} width={width} height={height} {...props} />;
}
