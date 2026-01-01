import React from 'react';
import { badgesRegistry, BadgeName } from './badges-registry';

interface BadgeProps extends React.SVGProps<SVGSVGElement> {
  name: BadgeName;
  size?: number | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  name,
  size = 24,
  className = "",
  ...props
}) => {
  const SVGComponent = badgesRegistry[name];

  if (!SVGComponent) {
    console.warn(`Badge "${name}" not found in badges-registry.`);
    return null;
  }

  return (
    <SVGComponent
      width={size}
      height={size}
      {...props}
    />
  );
};

export default Badge;
