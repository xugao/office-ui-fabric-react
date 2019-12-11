import { BaseMenu } from '../BaseMenu';
import { FluentMenuItem } from './FluentMenuItem';
import { composeNew } from './compose';

export const FluentMenu = composeNew({
  themeName: 'FluentMenu',
  baseComponent: BaseMenu,
  slots: {
    item: FluentMenuItem
  }
});
