import * as React from 'react';
import { ChoiceGroupBase as ChoiceGroupOriginal } from 'office-ui-fabric-react';

export const ChoiceGroupBase = () => (
  <ChoiceGroupOriginal
    className="defaultChoiceGroup"
    defaultSelectedKey="B"
    options={[
      {
        key: 'A',
        text: 'Option A',
      },
      {
        key: 'B',
        text: 'Option B',
      },
      {
        key: 'C',
        text: 'Option C',
        disabled: true,
      },
      {
        key: 'D',
        text: 'Option D',
      },
    ]}
    // label="Pick one"
    required={true}
  />
);

const scenario = <ChoiceGroupBase />;

export default scenario;
