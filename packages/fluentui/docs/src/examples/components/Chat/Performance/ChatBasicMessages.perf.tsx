import { Chat } from '@fluentui/react-northstar';
import * as _ from 'lodash';
import * as React from 'react';

const ChatBasicMessagesPerf = () => {
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
          />
        ),
      }))}
    />
  );
};

ChatBasicMessagesPerf.iterations = 1;
ChatBasicMessagesPerf.filename = 'ChatBasicMessages.perf.tsx';

export default ChatBasicMessagesPerf;
