import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertVariant } from '@patternfly/react-core';
import { TopicAdvanceConfig } from '@app/modules/Topics/components';
import { getTopic, updateTopicModel } from '@app/services';
import { ConfigContext } from '@app/contexts';
import {
  serializeTopic,
  deserializeTopic,
  IAdvancedTopic,
} from '@app/modules/Topics/utils';
import { isAxiosError } from '@app/utils/axios';
import { useAlert, useBasename } from '@rhoas/app-services-ui-shared';
import '../CreateTopicWizard/CreateTopicWizard.css';

export type UpdateTopicViewProps = {
  topicName: string;
  onDeleteTopic: () => void;
  onSaveTopic: () => void;
  onError?: (errorCode: number, message: string) => void;
};
export const UpdateTopicView: React.FunctionComponent<UpdateTopicViewProps> = ({
  topicName,
  onSaveTopic,
  onError,
}) => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const config = useContext(ConfigContext);
  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };
  const history = useHistory();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();

  const initialState = {
    name: topicName,
    numPartitions: '',
    'retention.ms': '7',
    'retention.ms.unit': 'days',
    'retention.bytes': '1',
    'retention.bytes.unit': 'bytes',
    'cleanup.policy': '',
    isRetentionTimeUnlimited: false,
    isRetentionSizeUnlimited: true,
  };

  const [topicData, setTopicData] = useState<IAdvancedTopic>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onCancelUpdateTopic = () => {
    history.push(`${basename}/topics/${topicName}`);
  };

  const fetchTopic = async (topicName) => {
    try {
      await getTopic(topicName, config).then((topicRes) => {
        const deserializedTopic = deserializeTopic(topicRes);

        setTopicData({
          ...topicData,
          ...deserializedTopic,
          numPartitions: topicRes?.partitions?.length.toString() || '',
          replicationFactor:
            (topicRes?.partitions &&
              topicRes?.partitions[0].replicas?.length.toString()) ||
            '',
        });
      });
    } catch (err) {
      if (isAxiosError(err)) {
        let message: string | undefined;
        let code: number | undefined;
        if (err && isAxiosError(err)) {
          code = err.response?.data.code;
          message = err.response?.data.error_message;
        }
        if (onError) {
          onError(code || -1, message || '');
        }
        if (err.response?.status === 404) {
          // then it's a non-existent topic
          addAlert({
            variant: AlertVariant.danger,
            title: `Topic ${topicName} does not exist`,
          });
          onCancelUpdateTopic && onCancelUpdateTopic();
        }
      }
    }
  };

  useEffect(() => {
    fetchTopic(topicName);
  }, [topicName]);

  const saveTopic = async () => {
    const { name, settings } = serializeTopic(topicData, ['cleanup.policy']);
    setIsLoading(true);

    try {
      await updateTopicModel(name, settings, config).then(() => {
        addAlert({
          title: t('topic.topic_successfully_updated'),
          variant: AlertVariant.success,
        });
        setIsLoading(false);
        onSaveTopic();
      });
    } catch (err) {
      let message: string | undefined;
      let code: number | undefined;
      if (err && isAxiosError(err)) {
        code = err.response?.data.code;
        message = err.response?.data.error_message;
      }
      if (onError) {
        onError(code || -1, message || '');
      }
      setIsLoading(false);
      addAlert({
        title: message || '',
        variant: AlertVariant.danger,
      });
    }
  };

  return (
    <>
      <TopicAdvanceConfig
        isCreate={false}
        saveTopic={saveTopic}
        handleCancel={onCancelUpdateTopic}
        topicData={topicData}
        setTopicData={setTopicData}
        isLoadingSave={isLoading}
      />
      <br />
      <br />
    </>
  );
};
