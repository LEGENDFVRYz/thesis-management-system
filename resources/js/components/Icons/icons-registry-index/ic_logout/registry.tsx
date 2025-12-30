import LogoutClicked from '../../ic_logout-Clicked.svg';
import LogoutDefault from '../../ic_logout-Default.svg';
import LogoutHover from '../../ic_logout-Hover.svg';

export const registry = {
  clicked: LogoutClicked,
  default: LogoutDefault,
  hover: LogoutHover,
};

export type Variant = keyof typeof registry;
