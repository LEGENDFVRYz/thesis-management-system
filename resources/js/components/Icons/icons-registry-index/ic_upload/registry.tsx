import UploadClicked from '../../ic_upload-Clicked.svg';
import UploadDefault from '../../ic_upload-Default.svg';
import UploadHover from '../../ic_upload-Hover.svg';

export const registry = {
  clicked: UploadClicked,
  default: UploadDefault,
  hover: UploadHover,
};

export type Variant = keyof typeof registry;
