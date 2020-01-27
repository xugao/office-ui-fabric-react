import { initializeIcons } from '@uifabric/icons';
import generateStoriesFromExamples from '@uifabric/build/config/storybook/generateStoriesFromExamples';
import { configure, addParameters, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withInfo());
addDecorator(withA11y());
addParameters({
  a11y: {
    manual: true
  }
});

initializeIcons();

const req = require.context('../src/components', true, /\.Example\.tsx$/);

function loadStories() {
  const stories = new Map();

  req.keys().forEach(key => {
    generateStoriesFromExamples({ key, req, stories });
  });

  // convert stories Set to array
  return [...stories.values()];
}

configure(loadStories, module);
