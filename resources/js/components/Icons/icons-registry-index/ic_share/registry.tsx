import ShareClicked from '../../ic_share-Clicked.svg';
import ShareDefault from '../../ic_share-Default.svg';
import ShareHover from '../../ic_share-Hover.svg';

export const registry = {
  clicked: ShareClicked,
  default: ShareDefault,
  hover: ShareHover,
};

export type Variant = keyof typeof registry;
