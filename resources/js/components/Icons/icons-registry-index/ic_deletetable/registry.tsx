import DeletetableDefault from '../../ic_deletetable-Default.svg';
import DeletetableVariant2 from '../../ic_deletetable-Variant2.svg';

export const registry = {
  default: DeletetableDefault,
  variant2: DeletetableVariant2,
};

export type Variant = keyof typeof registry;
