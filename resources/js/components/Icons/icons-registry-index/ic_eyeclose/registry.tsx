import EyecloseClicked from '../../ic_eyeclose-Clicked.svg';
import EyecloseDefault from '../../ic_eyeclose-Default.svg';
import EyecloseHover from '../../ic_eyeclose-Hover.svg';

export const registry = {
  clicked: EyecloseClicked,
  default: EyecloseDefault,
  hover: EyecloseHover,
};

export type Variant = keyof typeof registry;
