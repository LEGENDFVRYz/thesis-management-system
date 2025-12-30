import BackClicked from '../../ic_back-Clicked.svg';
import BackDefault from '../../ic_back-Default.svg';
import BackHover from '../../ic_back-Hover.svg';

export const registry = {
  clicked: BackClicked,
  default: BackDefault,
  hover: BackHover,
};

export type Variant = keyof typeof registry;
