/*! Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license. */
import * as React from 'react';
import Screener from 'screener-storybook/src/screener';
import { storiesOf } from '@storybook/react';
import { FabricDecoratorFullWidth } from '../utilities';
import { mergeStyleSets, DefaultPalette, IStyle, Stack } from '@fluentui/react';

const rootStyles = {
  background: DefaultPalette.themeTertiary,
};

const itemStyles = {
  background: DefaultPalette.themePrimary,
  color: DefaultPalette.white,
  padding: 5,
};

const boxStyles: IStyle = {
  ...itemStyles,
  display: 'flex',
  justifyContent: 'center' as 'center',
  alignItems: 'center' as 'center',
  width: '50px',
  height: '50px',
  padding: 0,
};

const styles = mergeStyleSets({
  root: rootStyles,

  fixedHeight: {
    ...rootStyles,
    height: '300px',
  },

  item: itemStyles,

  boxItem: boxStyles,

  verticalShrinkItem: {
    ...itemStyles,
    height: '100px',
  },

  horizontalShrinkItem: {
    ...itemStyles,
    width: '400px',
  },

  shadowItem: {
    ...boxStyles,
    boxShadow: `0px 0px 5px 5px ${DefaultPalette.themeDarker}`,
  },
});

const defaultProps = {
  className: styles.root,
  children: [
    <span key={1} className={styles.boxItem}>
      1
    </span>,
    <span key={2} className={styles.boxItem}>
      2
    </span>,
    <span key={3} className={styles.boxItem}>
      3
    </span>,
  ],
};

storiesOf('Stack', module)
  .addDecorator(FabricDecoratorFullWidth)
  .addDecorator(story =>
    // prettier-ignore
    <Screener
      steps={new Screener.Steps()
        .snapshot('default', { cropTo: '.testWrapper' })
        .end()
      }
    >
      {story()}
    </Screener>,
  )
  .addStory('Vertical Stack - Default', () => <Stack {...defaultProps} />, { rtl: true })
  .addStory('Vertical Stack - Reversed', () => <Stack reversed {...defaultProps} />, { rtl: true })
  .addStory('Vertical Stack - Padding', () => <Stack {...defaultProps} padding={10} />)
  .addStory('Vertical Stack - Gap', () => <Stack {...defaultProps} tokens={{ childrenGap: 10 }} />)
  .addStory('Vertical Stack - Vertically centered', () => (
    <Stack {...defaultProps} verticalAlign="center" className={styles.fixedHeight} />
  ))
  .addStory('Vertical Stack - Bottom-aligned', () => (
    <Stack {...defaultProps} verticalAlign="end" className={styles.fixedHeight} />
  ))
  .addStory('Vertical Stack - Space around', () => (
    <Stack {...defaultProps} verticalAlign="space-around" className={styles.fixedHeight} />
  ))
  .addStory('Vertical Stack - Space between', () => (
    <Stack {...defaultProps} verticalAlign="space-between" className={styles.fixedHeight} />
  ))
  .addStory('Vertical Stack - Space evenly', () => (
    <Stack {...defaultProps} verticalAlign="space-evenly" className={styles.fixedHeight} />
  ))
  .addStory('Vertical Stack - Horizontally centered', () => (
    <Stack {...defaultProps} horizontalAlign="center" />
  ))
  .addStory(
    'Vertical Stack - Right-aligned',
    () => <Stack {...defaultProps} horizontalAlign="end" />,
    { rtl: true },
  )
  .addStory(
    'Vertical Stack - Item alignments',
    () => (
      <Stack {...defaultProps} tokens={{ childrenGap: 10 }}>
        <Stack.Item align="auto" className={styles.item}>
          Auto-aligned item
        </Stack.Item>
        <Stack.Item align="stretch" className={styles.item}>
          Stretch-aligned item
        </Stack.Item>
        <Stack.Item align="baseline" className={styles.item}>
          Baseline-aligned item
        </Stack.Item>
        <Stack.Item align="start" className={styles.item}>
          Start-aligned item
        </Stack.Item>
        <Stack.Item align="center" className={styles.item}>
          Center-aligned item
        </Stack.Item>
        <Stack.Item align="end" className={styles.item}>
          End-aligned item
        </Stack.Item>
      </Stack>
    ),
    { rtl: true },
  )
  .addStory('Vertical Stack - Growing items', () => (
    <Stack {...defaultProps} tokens={{ childrenGap: 10 }} className={styles.fixedHeight}>
      <Stack.Item grow={3} className={styles.item}>
        Grow is 3
      </Stack.Item>
      <Stack.Item grow={2} className={styles.item}>
        Grow is 2
      </Stack.Item>
      <Stack.Item grow className={styles.item}>
        Grow is 1
      </Stack.Item>
    </Stack>
  ))
  .addStory('Vertical Stack - Shrinking items', () => (
    <Stack {...defaultProps} tokens={{ childrenGap: 10 }} className={styles.fixedHeight}>
      <Stack.Item className={styles.verticalShrinkItem}>1</Stack.Item>
      <Stack.Item disableShrink className={styles.verticalShrinkItem}>
        2 (does not shrink)
      </Stack.Item>
      <Stack.Item className={styles.verticalShrinkItem}>3</Stack.Item>
      <Stack.Item className={styles.verticalShrinkItem}>4</Stack.Item>
      <Stack.Item className={styles.verticalShrinkItem}>5</Stack.Item>
    </Stack>
  ))
  .addStory(
    'Vertical Stack - Wrap',
    () => (
      <Stack {...defaultProps} tokens={{ childrenGap: '10 0' }} wrap className={styles.fixedHeight}>
        <span className={styles.boxItem}>1</span>
        <span className={styles.boxItem}>2</span>
        <span className={styles.boxItem}>3</span>
        <span className={styles.boxItem}>4</span>
        <span className={styles.boxItem}>5</span>
        <span className={styles.boxItem}>6</span>
        <span className={styles.boxItem}>7</span>
        <span className={styles.boxItem}>8</span>
        <span className={styles.boxItem}>9</span>
        <span className={styles.boxItem}>10</span>
        <span className={styles.boxItem}>11</span>
        <span className={styles.boxItem}>12</span>
        <span className={styles.boxItem}>13</span>
        <span className={styles.boxItem}>14</span>
        <span className={styles.boxItem}>15</span>
      </Stack>
    ),
    { rtl: true },
  )
  .addStory('Vertical Stack - Box shadow around items', () => (
    <Stack {...defaultProps} tokens={{ childrenGap: 25 }}>
      <span className={styles.shadowItem}>1</span>
      <span className={styles.shadowItem}>2</span>
      <span className={styles.shadowItem}>3</span>
      <span className={styles.shadowItem}>4</span>
      <span className={styles.shadowItem}>5</span>
    </Stack>
  ))
  .addStory('Horizontal Stack - Default', () => <Stack horizontal {...defaultProps} />, {
    rtl: true,
  })
  .addStory('Horizontal Stack - Reversed', () => <Stack horizontal reversed {...defaultProps} />, {
    rtl: true,
  })
  .addStory('Horizontal Stack - Padding', () => <Stack horizontal {...defaultProps} padding={10} />)
  .addStory(
    'Horizontal Stack - Gap',
    () => <Stack horizontal {...defaultProps} tokens={{ childrenGap: 10 }} />,
    { rtl: true },
  )
  .addStory('Horizontal Stack - Horizontally centered', () => (
    <Stack horizontal {...defaultProps} horizontalAlign="center" />
  ))
  .addStory(
    'Horizontal Stack - Right-aligned',
    () => <Stack horizontal {...defaultProps} horizontalAlign="end" />,
    { rtl: true },
  )
  .addStory('Horizontal Stack - Space around', () => (
    <Stack horizontal {...defaultProps} horizontalAlign="space-around" />
  ))
  .addStory('Horizontal Stack - Space between', () => (
    <Stack horizontal {...defaultProps} horizontalAlign="space-between" />
  ))
  .addStory('Horizontal Stack - Space evenly', () => (
    <Stack horizontal {...defaultProps} horizontalAlign="space-evenly" />
  ))
  .addStory('Horizontal Stack - Vertically centered', () => (
    <Stack horizontal {...defaultProps} verticalAlign="center" className={styles.fixedHeight} />
  ))
  .addStory('Horizontal Stack - Bottom-aligned', () => (
    <Stack horizontal {...defaultProps} verticalAlign="end" className={styles.fixedHeight} />
  ))
  .addStory(
    'Horizontal Stack - Item alignments',
    () => (
      <Stack
        horizontal
        {...defaultProps}
        tokens={{ childrenGap: 10 }}
        className={styles.fixedHeight}
      >
        <Stack.Item align="auto" className={styles.item}>
          Auto-aligned item
        </Stack.Item>
        <Stack.Item align="stretch" className={styles.item}>
          Stretch-aligned item
        </Stack.Item>
        <Stack.Item align="baseline" className={styles.item}>
          Baseline-aligned item
        </Stack.Item>
        <Stack.Item align="start" className={styles.item}>
          Start-aligned item
        </Stack.Item>
        <Stack.Item align="center" className={styles.item}>
          Center-aligned item
        </Stack.Item>
        <Stack.Item align="end" className={styles.item}>
          End-aligned item
        </Stack.Item>
      </Stack>
    ),
    { rtl: true },
  )
  .addStory('Horizontal Stack - Growing items', () => (
    <Stack horizontal {...defaultProps} tokens={{ childrenGap: 10 }}>
      <Stack.Item grow={3} className={styles.item}>
        Grow is 3
      </Stack.Item>
      <Stack.Item grow={2} className={styles.item}>
        Grow is 2
      </Stack.Item>
      <Stack.Item grow className={styles.item}>
        Grow is 1
      </Stack.Item>
    </Stack>
  ))
  .addStory('Horizontal Stack - Shrinking items', () => (
    <Stack horizontal {...defaultProps} tokens={{ childrenGap: 10 }}>
      <Stack.Item className={styles.horizontalShrinkItem}>1</Stack.Item>
      <Stack.Item disableShrink className={styles.horizontalShrinkItem}>
        2 (does not shrink)
      </Stack.Item>
      <Stack.Item className={styles.horizontalShrinkItem}>3</Stack.Item>
      <Stack.Item className={styles.horizontalShrinkItem}>4</Stack.Item>
      <Stack.Item className={styles.horizontalShrinkItem}>5</Stack.Item>
      <Stack.Item className={styles.horizontalShrinkItem}>6</Stack.Item>
      <Stack.Item className={styles.horizontalShrinkItem}>7</Stack.Item>
    </Stack>
  ))
  .addStory(
    'Horizontal Stack - Wrap',
    () => (
      <Stack horizontal {...defaultProps} tokens={{ childrenGap: 10 }} wrap>
        <span className={styles.boxItem}>1</span>
        <span className={styles.boxItem}>2</span>
        <span className={styles.boxItem}>3</span>
        <span className={styles.boxItem}>4</span>
        <span className={styles.boxItem}>5</span>
        <span className={styles.boxItem}>6</span>
        <span className={styles.boxItem}>7</span>
        <span className={styles.boxItem}>8</span>
        <span className={styles.boxItem}>9</span>
        <span className={styles.boxItem}>10</span>
        <span className={styles.boxItem}>11</span>
        <span className={styles.boxItem}>12</span>
        <span className={styles.boxItem}>13</span>
        <span className={styles.boxItem}>14</span>
        <span className={styles.boxItem}>15</span>
        <span className={styles.boxItem}>16</span>
        <span className={styles.boxItem}>17</span>
        <span className={styles.boxItem}>18</span>
        <span className={styles.boxItem}>19</span>
        <span className={styles.boxItem}>20</span>
        <span className={styles.boxItem}>22</span>
        <span className={styles.boxItem}>23</span>
        <span className={styles.boxItem}>24</span>
        <span className={styles.boxItem}>25</span>
        <span className={styles.boxItem}>26</span>
        <span className={styles.boxItem}>27</span>
        <span className={styles.boxItem}>28</span>
        <span className={styles.boxItem}>29</span>
        <span className={styles.boxItem}>30</span>
      </Stack>
    ),
    { rtl: true },
  )
  .addStory('Horizontal Stack - Wrap with specified vertical gap', () => (
    <Stack horizontal {...defaultProps} wrap tokens={{ childrenGap: '40 10' }}>
      <span className={styles.boxItem}>1</span>
      <span className={styles.boxItem}>2</span>
      <span className={styles.boxItem}>3</span>
      <span className={styles.boxItem}>4</span>
      <span className={styles.boxItem}>5</span>
      <span className={styles.boxItem}>6</span>
      <span className={styles.boxItem}>7</span>
      <span className={styles.boxItem}>8</span>
      <span className={styles.boxItem}>9</span>
      <span className={styles.boxItem}>10</span>
      <span className={styles.boxItem}>11</span>
      <span className={styles.boxItem}>12</span>
      <span className={styles.boxItem}>13</span>
      <span className={styles.boxItem}>14</span>
      <span className={styles.boxItem}>15</span>
      <span className={styles.boxItem}>16</span>
      <span className={styles.boxItem}>17</span>
      <span className={styles.boxItem}>18</span>
      <span className={styles.boxItem}>19</span>
      <span className={styles.boxItem}>20</span>
      <span className={styles.boxItem}>22</span>
      <span className={styles.boxItem}>23</span>
      <span className={styles.boxItem}>24</span>
      <span className={styles.boxItem}>25</span>
      <span className={styles.boxItem}>26</span>
      <span className={styles.boxItem}>27</span>
      <span className={styles.boxItem}>28</span>
      <span className={styles.boxItem}>29</span>
      <span className={styles.boxItem}>30</span>
    </Stack>
  ))
  .addStory('Horizontal Stack - Box shadow around items', () => (
    <Stack horizontal {...defaultProps} tokens={{ childrenGap: 25 }}>
      <span className={styles.shadowItem}>1</span>
      <span className={styles.shadowItem}>2</span>
      <span className={styles.shadowItem}>3</span>
      <span className={styles.shadowItem}>4</span>
      <span className={styles.shadowItem}>5</span>
    </Stack>
  ));
