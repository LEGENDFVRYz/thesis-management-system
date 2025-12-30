import CloseClicked from '../../ic_close-Clicked.svg';
import CloseDefault from '../../ic_close-Default.svg';
import CloseHover from '../../ic_close-Hover.svg';

export const registry = {
  clicked: CloseClicked,
  default: CloseDefault,
  hover: CloseHover,
};

export type Variant = keyof typeof registry;
