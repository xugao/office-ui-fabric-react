import { classNamesFunction, divProperties, getNativeProps } from 'office-ui-fabric-react';
import * as React from 'react';

import { ILabelProps, ILabelStyleProps, ILabelStyles } from './Label.types';

const getClassNames = classNamesFunction<ILabelStyleProps, ILabelStyles>({
  disableCaching: true,
});

export class LabelBase extends React.Component<ILabelProps, {}> {
  public render(): JSX.Element {
    const { as: RootType = 'label', children } = this.props;
    const classNames = this._getClassNames();
    return (
      <RootType {...getNativeProps(this.props, divProperties)} className={classNames.root}>
        {children}
      </RootType>
    );
  }

  private _getClassNames() {
    if ((this.props as any).classes) {
      const struct = (this.props as any).classes as any;
      const { required, disabled } = this.props;
      return struct[(!!required).toString()][(!!disabled).toString()];
    } else {
      const { className, disabled, styles, required, theme } = this.props;
      const classNames = getClassNames(styles, {
        className,
        disabled,
        required,
        theme: theme!,
      });
      return classNames;
    }
  }
}
