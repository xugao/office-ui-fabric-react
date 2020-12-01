import {
  Accessibility,
  Chat,
  Menu,
  menuAsToolbarBehavior,
  Popup,
  Reaction,
  ReactionProps,
  ShorthandCollection,
} from '@fluentui/react-northstar';
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

const popoverBehavior: Accessibility = (props: any) => {
  const behavior = menuAsToolbarBehavior(props);

  behavior.focusZone.props.defaultTabbableElement = (root: HTMLElement): HTMLElement => {
    return root.querySelector('[aria-label="thumbs up"]');
  };

  return behavior;
};

const reactions: ShorthandCollection<ReactionProps> = [
  {
    icon: <LikeIcon />,
    content: '1K',
    key: 'likes',
    variables: { meReacting: true },
    children: (Component, props) => <ReactionPopup {...props} />,
  },
  {
    icon: <EmojiIcon />,
    content: 2,
    key: 'smiles',
    children: (Component, props) => <ReactionPopup {...props} />,
  },
];

const getAriaLabel = ({ content: numberOfPersons, icon: emojiType }: ReactionProps) => {
  if (numberOfPersons === 1) {
    return `One person reacted to this message with a ${emojiType} emoji. Open menu to see person who reacted.`;
  }
  return `${numberOfPersons} people reacted this message with a ${emojiType} emoji. Open menu to see people who reacted.`;
};

class ReactionPopup extends React.Component<ReactionProps, { open: boolean }> {
  state = {
    open: false,
  };

  handleKeyDownOnMenu = e => {
    if (e.keyCode === '') {
      this.setState({ open: false });
    }
  };

  handleOpenChange = (e, { open }) => {
    this.setState({ open });
  };

  render() {
    return (
      <Popup
        autoFocus
        trigger={<Reaction as="button" aria-haspopup="true" {...this.props} aria-label={getAriaLabel(this.props)} />}
        content={{
          children: () => (
            <Menu
              items={['Jane Doe', 'John Doe']}
              vertical
              variables={{ borderColor: 'transparent' }}
              onKeyDown={this.handleKeyDownOnMenu}
            />
          ),
        }}
        inline
        on="hover"
        position="below"
        open={this.state.open}
        onOpenChange={this.handleOpenChange}
      />
    );
  }
}

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

const ChatWithPopoverAndReactionsPerf = () => {
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
            reactionGroup={reactions}
          />
        ),
      }))}
    />
  );
};

ChatWithPopoverAndReactionsPerf.iterations = 1;
ChatWithPopoverAndReactionsPerf.filename = 'ChatWithPopoverAndReactions.perf.tsx';

export default ChatWithPopoverAndReactionsPerf;
