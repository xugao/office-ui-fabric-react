import * as React from 'react';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

export class SpinButtonBasicExample extends React.Component<any, any> {
  public render(): JSX.Element {
    return (
      <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: 400 } }}>
        <SpinButton
          defaultValue="0"
          label={'Basic SpinButton:'}
          min={0}
          max={100}
          step={1}
          iconProps={{ iconName: 'IncreaseIndentLegacy' }}
          // tslint:disable:jsx-no-lambda
          onFocus={() => console.log('onFocus called')}
          onBlur={() => console.log('onBlur called')}
          incrementButtonAriaLabel={'Increase value by 1'}
          decrementButtonAriaLabel={'Decrease value by 1'}
        />
        <SpinButton
          defaultValue="0"
          label={'Decimal SpinButton:'}
          min={0}
          max={10}
          step={0.1}
          onFocus={() => console.log('onFocus called')}
          onBlur={() => console.log('onBlur called')}
          incrementButtonAriaLabel={'Increase value by 0.1'}
          decrementButtonAriaLabel={'Decrease value by 0.1'}
        />
      </Stack>
    );
  }
}
