import { BeachballConfig } from 'beachball';
import { renderHeader, renderEntry } from './customRenderers';

export const config: BeachballConfig = {
  groups: [
    {
      name: 'Fluent UI React',
      include: ['packages/office-ui-fabric-react', 'packages/react'],
      disallowedChangeTypes: ['major'],
    },
  ],
  changelog: {
    customRenderers: {
      renderHeader,
      renderEntry,
    },
    groups: [
      {
        masterPackageName: '@fluentui/react-northstar',
        changelogPath: 'packages/fluentui',
        include: ['packages/fluentui/*'],
      },
    ],
  },
};
