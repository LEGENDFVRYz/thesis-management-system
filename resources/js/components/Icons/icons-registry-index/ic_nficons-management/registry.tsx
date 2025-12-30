import NficonsManagement from '../../ic_nficons-management.svg';

export const registry = {
  default: NficonsManagement,
};

export type Variant = keyof typeof registry;
