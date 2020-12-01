import { Chat, Avatar, ChatMessageProps, ShorthandCollection, ReactionProps } from '@fluentui/react-northstar';
import * as React from 'react';
import Popover from './Popover';
import ReactionPopup from './ReactionPopup';
import { Ref } from '@fluentui/react-component-ref';
import { AcceptIcon, EmojiIcon, LikeIcon } from '@fluentui/react-icons-northstar';

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

const janeAvatar = {
  image: 'public/images/avatar/small/ade.jpg',
  status: { color: 'green', icon: <AcceptIcon /> },
};

const ChatWithPopover = () => {
  return (
    <Chat
      items={[
        {
          key: 'a',
          message: (
            <TeamsChatMessage
              author="Jane Doe"
              content={
                <div>
                  <a href="/">Link</a> Hover me to see the actions <a href="/">Some Link</a>
                </div>
              }
              reactionGroup={{
                items: reactions,
              }}
              timestamp="Yesterday, 10:15 PM"
            />
          ),
          gutter: <Avatar {...janeAvatar} />,
        },
        {
          key: 'b',
          message: (
            <TeamsChatMessage
              author="Jane Doe"
              content={
                <div>
                  <a href="/">Link</a> Hover me to see the actions <a href="/">Some Link</a>
                </div>
              }
              reactionGroup={{
                items: reactions,
              }}
              timestamp="Yesterday, 10:15 PM"
            />
          ),
          gutter: <Avatar {...janeAvatar} />,
        },
      ]}
    />
  );
};

const TeamsChatMessage: React.FC<ChatMessageProps> = (props: ChatMessageProps) => {
  const [showActionMenu, setShowActionMenu] = React.useState(false);
  const [forceShowActionMenu, setForceShowActionMenu] = React.useState(false);
  const [chatMessageElement, setChatMessageElement] = React.useState<HTMLElement>(null);

  const handleBlur = e => !e.currentTarget.contains(e.relatedTarget) && setShowActionMenu(false);

  return (
    <Ref innerRef={setChatMessageElement}>
      <Chat.Message
        {...props}
        actionMenu={{
          children: (Component, props) => (
            <Popover
              chatMessageElement={chatMessageElement}
              onForceShowActionMenuChange={setForceShowActionMenu}
              onShowActionMenuChange={setShowActionMenu}
              {...props}
            />
          ),
        }}
        onMouseEnter={() => setShowActionMenu(true)}
        onMouseLeave={() => !forceShowActionMenu && setShowActionMenu(false)}
        onFocus={() => setShowActionMenu(true)}
        onBlur={handleBlur}
        variables={{ showActionMenu }}
      />
    </Ref>
  );
};

export default ChatWithPopover;
