import ArchiveClicked from '../../ic_archive-Clicked.svg';
import ArchiveDefault from '../../ic_archive-Default.svg';
import ArchiveHover from '../../ic_archive-Hover.svg';

export const registry = {
  clicked: ArchiveClicked,
  default: ArchiveDefault,
  hover: ArchiveHover,
};

export type Variant = keyof typeof registry;
