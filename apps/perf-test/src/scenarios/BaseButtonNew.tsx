import * as React from 'react';
import { BaseButton, customizable, nullRender, CustomizerContext, ICustomizerContext } from 'office-ui-fabric-react';
import { IButtonProps } from 'office-ui-fabric-react/lib/Button';

/**
 * {@docCategory Button}
 */
@customizable('BaseButtonNew', ['theme', 'styles'], true)
export class BaseButtonNew extends React.Component<IButtonProps, {}> {
  public render(): JSX.Element {
    return <BaseButton text="I am a button" />;
  }
}

export class BaseButtonNew2 extends React.Component<IButtonProps, {}> {
  public render(): JSX.Element {
    return (
      <CustomizerContext.Consumer>
        {(context: ICustomizerContext) => {
          return <BaseButton text="I am a button" />;
        }}
      </CustomizerContext.Consumer>
    );
  }
}

const scenario = <BaseButtonNew2 text="I am a button" />;

export default scenario;
