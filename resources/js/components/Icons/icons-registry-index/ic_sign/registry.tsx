import SignClicked from '../../ic_sign-Clicked.svg';
import SignDefault from '../../ic_sign-Default.svg';
import SignHover from '../../ic_sign-Hover.svg';

export const registry = {
  clicked: SignClicked,
  default: SignDefault,
  hover: SignHover,
};

export type Variant = keyof typeof registry;
