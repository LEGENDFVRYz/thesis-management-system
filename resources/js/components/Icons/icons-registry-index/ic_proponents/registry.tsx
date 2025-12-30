import ProponentsClicked from '../../ic_proponents-Clicked.svg';
import ProponentsDefault from '../../ic_proponents-Default.svg';
import ProponentsHover from '../../ic_proponents-Hover.svg';

export const registry = {
  clicked: ProponentsClicked,
  default: ProponentsDefault,
  hover: ProponentsHover,
};

export type Variant = keyof typeof registry;
