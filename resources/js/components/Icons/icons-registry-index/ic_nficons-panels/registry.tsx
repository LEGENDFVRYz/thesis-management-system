import NficonsPanels from '../../ic_nficons-panels.svg';

export const registry = {
  default: NficonsPanels,
};

export type Variant = keyof typeof registry;
