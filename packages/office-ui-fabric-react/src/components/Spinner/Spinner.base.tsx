import * as React from 'react';
import { ISpinnerProps, ISpinnerStyleProps, ISpinnerStyles, SpinnerType, SpinnerSize } from './Spinner.types';
import { classNamesFunction, DelayedRender, getNativeDivProps } from '../../Utilities';

const getClassNames = classNamesFunction<ISpinnerStyleProps, ISpinnerStyles>();

export class SpinnerBase extends React.Component<ISpinnerProps, any> {
  public static defaultProps: ISpinnerProps = {
    size: SpinnerSize.medium,
    ariaLive: 'polite',
    labelPosition: 'bottom',
  };

  public render() {
    // tslint:disable-next-line:deprecation
    const { type, size, ariaLabel, ariaLive, styles, label, theme, className, labelPosition } = this.props;
    const statusMessage = ariaLabel;
    const nativeProps = getNativeDivProps(this.props, new Set(['size']));

    // SpinnerType is deprecated. If someone is still using this property, rather than putting the SpinnerType into the
    // ISpinnerStyleProps, we'll map SpinnerType to its equivalent SpinnerSize and pass that in. Once SpinnerType
    // finally goes away we should delete this.
    let styleSize = size;
    if (styleSize === undefined && type !== undefined) {
      // tslint:disable-next-line:deprecation
      styleSize = type === SpinnerType.large ? SpinnerSize.large : SpinnerSize.medium;
    }

    const classNames = getClassNames(styles!, {
      theme: theme!,
      size: styleSize,
      className,
      labelPosition,
    });

    return (
      <div {...nativeProps} className={classNames.root}>
        <div className={classNames.circle} />
        {label && <div className={classNames.label}>{label}</div>}
        {statusMessage && (
          <div role="status" aria-live={ariaLive}>
            <DelayedRender>
              <div className={classNames.screenReaderText}>{statusMessage}</div>
            </DelayedRender>
          </div>
        )}
      </div>
    );
  }
}
