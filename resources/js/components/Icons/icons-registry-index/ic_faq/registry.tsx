import FaqClicked from '../../ic_faq-Clicked.svg';
import FaqDefault from '../../ic_faq-Default.svg';
import FaqHover from '../../ic_faq-Hover.svg';

export const registry = {
  clicked: FaqClicked,
  default: FaqDefault,
  hover: FaqHover,
};

export type Variant = keyof typeof registry;
