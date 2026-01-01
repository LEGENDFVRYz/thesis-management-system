import SearchClicked1 from '../../ic_search-Clicked-1.svg';
import SearchClicked from '../../ic_search-Clicked.svg';
import SearchDefault from '../../ic_search-Default.svg';

export const registry = {
  clicked1: SearchClicked1,
  clicked: SearchClicked,
  default: SearchDefault,
};

export type Variant = keyof typeof registry;
