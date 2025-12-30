import EdittableDefault from '../../ic_edittable-Default.svg';
import EdittableVariant2 from '../../ic_edittable-Variant2.svg';

export const registry = {
  default: EdittableDefault,
  variant2: EdittableVariant2,
};

export type Variant = keyof typeof registry;
