import * as React from 'react';
import { getNativeProps, anchorProperties, buttonProperties } from '@uifabric/utilities';

/**
 * TODO:
 * 1) do we really need slots prop?
 */
interface IBaseButtonProps extends React.AllHTMLAttributes<any> {
  slots?: any;
  slotProps?: any;
}

export const BaseButton: React.FunctionComponent<IBaseButtonProps> = props => {
  const { slots, children, slotProps, ...rest } = props;
  const { root: Root = 'button', icon: Icon, primaryText: PrimaryText, secondaryText: SecondaryText } = slots || {};
  const { root = {}, icon = {}, primaryText = {}, secondaryText = {} } = slotProps || {};

  const rootClassName = `${root.className || ''}${` ${rest.className}` || ''}`;
  const content = children ? (
    children
  ) : (
    <>
      {Icon && <Icon {...icon} />}
      {PrimaryText && <PrimaryText {...primaryText} />}
      {SecondaryText && <SecondaryText {...secondaryText} />}
    </>
  );

  const { htmlType, propertiesType } = _deriveRootType(props);
  const rootProps = { ...getNativeProps(rest, propertiesType), type: htmlType, className: rootClassName };

  return <Root {...rootProps}>{content}</Root>;
};

function _deriveRootType(props: IBaseButtonProps) {
  return !!props.href ? { htmlType: 'link', propertiesType: anchorProperties } : { htmlType: 'button', propertiesType: buttonProperties };
}
