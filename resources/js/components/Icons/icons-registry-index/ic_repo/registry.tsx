import RepoClicked from '../../ic_repo-Clicked.svg';
import RepoDefault from '../../ic_repo-Default.svg';
import RepoHover from '../../ic_repo-Hover.svg';

export const registry = {
  clicked: RepoClicked,
  default: RepoDefault,
  hover: RepoHover,
};

export type Variant = keyof typeof registry;
