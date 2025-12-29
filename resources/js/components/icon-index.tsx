import React from 'react';
import { iconRegistry, IconName } from './icons-registry';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  className = "", 
  ...props 
}) => {
  const SVGComponent = iconRegistry[name];

  if (!SVGComponent) {
    console.warn(`Icon "${name}" not found in icons-registry.`);
    return null;
  }

  return (
    <SVGComponent
      width={size}
      height={size}
    //   className={className}
      {...props}
    />
  );
};