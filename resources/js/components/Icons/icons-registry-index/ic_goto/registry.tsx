import GotoClicked from '../../ic_goto-Clicked.svg';
import GotoDefault from '../../ic_goto-Default.svg';
import GotoHover from '../../ic_goto-Hover.svg';

export const registry = {
  clicked: GotoClicked,
  default: GotoDefault,
  hover: GotoHover,
};

export type Variant = keyof typeof registry;
