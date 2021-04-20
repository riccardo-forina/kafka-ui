import React, { FunctionComponent } from 'react';
import './style.scss';
import { useHistory, useParams } from 'react-router';
import { UpdateTopicPage } from 'src/Modules/Topics/UpdateTopic/UpdateTopicPage';

type TopicUseParams = {
  topicName: string;
};

const UpdateTopic: FunctionComponent<TopicUseParams> = () => {
  const { topicName } = useParams<TopicUseParams>();
  const history = useHistory();
  return (
    <UpdateTopicPage
      topicName={topicName}
      onCancelUpdateTopic={() => history.push('/topics')}
      onDeleteTopic={() => {
        history.push('/topics');
        return;
      }}
      onSaveTopic={() => {
        history.push('/topics');
        return;
      }}
    />
  );
};

export { UpdateTopic };

export default UpdateTopic;
