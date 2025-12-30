import NficonsReminder from '../../ic_nficons-reminder.svg';

export const registry = {
  default: NficonsReminder,
};

export type Variant = keyof typeof registry;
