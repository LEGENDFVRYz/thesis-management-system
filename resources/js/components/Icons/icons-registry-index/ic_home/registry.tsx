import HomeClicked from '../../ic_home-Clicked.svg';
import HomeDefault from '../../ic_home-Default.svg';
import HomeHover from '../../ic_home-Hover.svg';

export const registry = {
  clicked: HomeClicked,
  default: HomeDefault,
  hover: HomeHover,
};

export type Variant = keyof typeof registry;
