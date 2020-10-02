/*! Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license. */
import * as React from 'react';
import Screener from 'screener-storybook/src/screener';
import { storiesOf } from '@storybook/react';
import { FabricDecorator } from '../utilities';
import { Icon, IconType, getIconClassName } from '@fluentui/react';
import * as IconNames from '../../../../packages/icons/src/IconNames';

import { TestImages } from '@uifabric/example-data';

// Rendering allIcons tests that the icon package can initialize all icons from the cdn
const allIcons: JSX.Element[] = [];
// eslint-disable-next-line guard-for-in
for (const iconName in (IconNames as any).IconNames) {
  allIcons.push(<Icon iconName={iconName} />);
}

storiesOf('Icon', module)
  .addDecorator(FabricDecorator)
  .addDecorator(story =>
    // prettier-ignore
    <Screener
      steps={new Screener.Steps()
        .snapshot('default', { cropTo: '.testWrapper' })
        .end()}
    >
      {story()}
    </Screener>,
  )
  .addStory('Root', () => (
    <div>
      <div>{allIcons}</div>
      <Icon className={getIconClassName('CompassNW')} />
      <Icon className={getIconClassName('Upload')} />
      <Icon className={getIconClassName('Share')} />
    </div>
  ))
  .addStory('Color', () => <Icon iconName={'CompassNW'} style={{ color: 'red' }} />)
  .addStory('Image', () => (
    <Icon
      iconName={'None'}
      iconType={IconType.image}
      imageProps={{
        src: TestImages.iconOne,
      }}
    />
  ));
