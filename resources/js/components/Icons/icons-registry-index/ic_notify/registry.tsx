import NotifyClicked from '../../ic_notify-Clicked.svg';
import NotifyDefault from '../../ic_notify-Default.svg';
import NotifyHover from '../../ic_notify-Hover.svg';

export const registry = {
  clicked: NotifyClicked,
  default: NotifyDefault,
  hover: NotifyHover,
};

export type Variant = keyof typeof registry;
