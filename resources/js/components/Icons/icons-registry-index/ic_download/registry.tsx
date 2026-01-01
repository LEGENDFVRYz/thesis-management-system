import DownloadClicked from '../../ic_download-Clicked.svg';
import DownloadDefault from '../../ic_download-Default.svg';
import DownloadHover from '../../ic_download-Hover.svg';

export const registry = {
  clicked: DownloadClicked,
  default: DownloadDefault,
  hover: DownloadHover,
};

export type Variant = keyof typeof registry;
