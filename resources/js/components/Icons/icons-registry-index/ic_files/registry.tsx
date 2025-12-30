import FilesClicked from '../../ic_files-Clicked.svg';
import FilesDefault from '../../ic_files-Default.svg';
import FilesHover from '../../ic_files-Hover.svg';

export const registry = {
  clicked: FilesClicked,
  default: FilesDefault,
  hover: FilesHover,
};

export type Variant = keyof typeof registry;
