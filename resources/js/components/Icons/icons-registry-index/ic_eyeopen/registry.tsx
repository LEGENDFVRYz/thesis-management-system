import EyeopenClicked from '../../ic_eyeopen-Clicked.svg';
import EyeopenDefault from '../../ic_eyeopen-Default.svg';
import EyeopenHover from '../../ic_eyeopen-Hover.svg';

export const registry = {
  clicked: EyeopenClicked,
  default: EyeopenDefault,
  hover: EyeopenHover,
};

export type Variant = keyof typeof registry;
