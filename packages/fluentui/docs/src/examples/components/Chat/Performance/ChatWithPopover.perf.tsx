import { Accessibility, Chat, Menu, menuAsToolbarBehavior } from '@fluentui/react-northstar';
import * as _ from 'lodash';
import cx from 'classnames';
import * as React from 'react';
import {
  DownloadIcon,
  EmojiIcon,
  LikeIcon,
  LinkIcon,
  MoreIcon,
  TranslationIcon,
} from '@fluentui/react-icons-northstar';

export interface PopoverProps {
  className?: string;
}

interface PopoverState {
  focused: boolean;
}

const popoverBehavior: Accessibility = () => {
  const behavior = menuAsToolbarBehavior();

  behavior.focusZone.props.defaultTabbableElement = (root: HTMLElement): HTMLElement => {
    return root.querySelector('[aria-label="thumbs up"]');
  };

  return behavior;
};

class Popover extends React.Component<PopoverProps, PopoverState> {
  state = {
    focused: false,
  };

  handleFocus = () => this.setState({ focused: true });

  handleBlur = e => {
    this.setState({ focused: e.currentTarget.contains(e.relatedTarget) });
  };

  render() {
    return (
      <Menu
        {...this.props}
        accessibility={popoverBehavior}
        iconOnly
        className={cx(this.props.className, this.state.focused ? 'focused' : '')}
        items={[
          {
            icon: <EmojiIcon />,
            key: 'smile',
            className: 'smile-emoji',
            'aria-label': 'smile one',
          },
          {
            icon: <EmojiIcon />,
            key: 'smile2',
            className: 'smile-emoji',
            'aria-label': 'smile two',
          },
          {
            icon: <EmojiIcon />,
            key: 'smile3',
            className: 'smile-emoji',
            'aria-label': 'smile three',
          },
          {
            icon: <LikeIcon />,
            key: 'a',
            'aria-label': 'thumbs up',
          },
          {
            icon: <MoreIcon />,
            key: 'c',
            'aria-label': 'more options',
            indicator: false,
            menu: {
              pills: true,
              items: [
                { key: 'bookmark', icon: <DownloadIcon />, content: 'Save this message' },
                { key: 'linkify', icon: <LinkIcon />, content: 'Copy link' },
                { key: 'translate', icon: <TranslationIcon />, content: 'Translate' },
              ],
            },
          },
        ]}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        data-is-focusable={true}
      />
    );
  }
}

const ChatWithPopoverPerf = () => {
  return (
    <Chat
      items={_.times(100, i => ({
        key: `a${i}`,
        message: (
          <Chat.Message
            actionMenu={<Popover />}
            author="Jane Doe"
            content={
              <div>
                <a href="/">Link</a> Hover me to see the actions <a href="/">Some Link</a>
              </div>
            }
            timestamp="Yesterday, 10:15 PM"
          />
        ),
      }))}
    />
  );
};

ChatWithPopoverPerf.iterations = 1;
ChatWithPopoverPerf.filename = 'ChatWithPopover.perf.tsx';

export default ChatWithPopoverPerf;
