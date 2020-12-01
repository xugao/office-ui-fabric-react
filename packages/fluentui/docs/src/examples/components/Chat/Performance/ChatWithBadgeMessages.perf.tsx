import { Chat } from '@fluentui/react-northstar';
import * as _ from 'lodash';
import * as React from 'react';
import { RedbangIcon } from '@fluentui/react-icons-northstar';

const ChatWithBadgeMessagesPerf = () => {
  return (
    <Chat
      items={_.times(100, i => ({
        key: `a${i}`,
        message: (
          <Chat.Message
            author="Jane Doe"
            content={
              <div>
                <a href="/">Link</a> Hover me to see the actions <a href="/">Some Link</a>
              </div>
            }
            timestamp="Yesterday, 10:15 PM"
            badge={{ icon: <RedbangIcon /> }}
            variables={{ isImportant: true }}
          />
        ),
      }))}
    />
  );
};

ChatWithBadgeMessagesPerf.iterations = 1;
ChatWithBadgeMessagesPerf.filename = 'ChatWithBadgeMessages.perf.tsx';

export default ChatWithBadgeMessagesPerf;
