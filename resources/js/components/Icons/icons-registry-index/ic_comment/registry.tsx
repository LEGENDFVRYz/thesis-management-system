import CommentClicked from '../../ic_comment-Clicked.svg';
import CommentDefault from '../../ic_comment-Default.svg';
import CommentHover from '../../ic_comment-Hover.svg';

export const registry = {
  clicked: CommentClicked,
  default: CommentDefault,
  hover: CommentHover,
};

export type Variant = keyof typeof registry;
