import { Chat } from '@fluentui/react-northstar';
import * as React from 'react';
import * as _ from 'lodash';

const ChatMinimalPerf = () => (
  <>
    {_.times(100, i => (
      <Chat key={i} />
    ))}
  </>
);

ChatMinimalPerf.iterations = 1;
ChatMinimalPerf.filename = 'ChatMinimal.perf.tsx';

export default ChatMinimalPerf;
