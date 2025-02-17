import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertVariant,
  PageSection,
  PageSectionVariants,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
} from '@patternfly/react-core';
import {
  TopicDetailHead,
  TopicDetailView,
} from '@app/modules/Topics/components';
import { getTopicDetail } from '@app/services';
import { ConfigContext, useFederated } from '@app/contexts';
import { ConsumerGroups } from '@app/modules/ConsumerGroups';
import { isAxiosError } from '@app/utils/axios';
import { IAdvancedTopic } from '@app/modules/Topics/utils';
import {
  useAlert,
  useBasename,
  ModalType,
  useModal,
} from '@rhoas/app-services-ui-shared';
import '../style.css';

export const TopicDetailPage: React.FC = () => {
  const {
    activeTab = 2,
    kafkaName,
    kafkaPageLink,
    kafkaInstanceLink,
    onError,
    showSchemas,
  } = useFederated() || {};

  const history = useHistory();
  const { topicName } = useParams<{ topicName: string }>();
  const { getBasename } = useBasename() || { getBasename: () => '' };
  const basename = getBasename();

  const [topicDetail, setTopicDetail] = useState<IAdvancedTopic>({
    name: topicName,
    numPartitions: '',
    'retention.ms': '',
    'retention.ms.unit': 'milliseconds',
    'retention.bytes': '',
    'retention.bytes.unit': 'bytes',
    'cleanup.policy': '',
  });
  const [activeTabKey, setActiveTabKey] = useState(activeTab);
  const config = useContext(ConfigContext);
  const { addAlert } = useAlert() || {
    addAlert: () => {
      // No-op
    },
  };
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  const contentRefConsumerGroup = React.createRef<HTMLElement>();
  const contentRefProperties = React.createRef<HTMLElement>();
  const contentRefSchemas = React.createRef<HTMLElement>();
  const { showModal } = useModal<ModalType.KafkaDeleteTopic>();

  const onDeleteTopic = () => {
    //Redirect on topics  viewpage after delete topic successfuly
    history.push(`${basename}/topics`);
  };

  const fetchTopicDetail = async (topicName: string) => {
    if (activeTab === 2) {
      try {
        await getTopicDetail(topicName, config).then((response) => {
          setTopicDetail(response);
        });
      } catch (err) {
        if (isAxiosError(err)) {
          if (onError) {
            onError(
              err.response?.data.code || -1,
              err.response?.data.error_message
            );
          }
          if (err.response?.status === 404) {
            // then it's a non-existent topic
            addAlert({
              title: t('topic.topic_not_found', { name: topicName }),
              variant: AlertVariant.danger,
            });
          }
        }
      }
    }
  };

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  // Make the get request
  useEffect(() => {
    fetchTopicDetail(topicName);
  }, [topicName]);

  const deleteTopic = () => {
    showModal(ModalType.KafkaDeleteTopic, {
      topicName,
      onDeleteTopic,
    });
  };

  return (
    <>
      <TopicDetailHead
        topicName={topicName}
        kafkaName={kafkaName}
        kafkaPageLink={kafkaPageLink}
        kafkaInstanceLink={kafkaInstanceLink}
      />
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: 'noPadding' }}
        className='pf-c-page__main-tabs'
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          isBox={false}
          className='pf-m-page-insets'
        >
          <Tab
            eventKey={1}
            data-testid='pageTopic-tabConsumers'
            title={
              <TabTitleText>{t('consumerGroup.consumer_groups')}</TabTitleText>
            }
            tabContentId='kafka-ui-TabcontentConsumerGroupList'
            tabContentRef={contentRefConsumerGroup}
          ></Tab>
          <Tab
            eventKey={2}
            title={<TabTitleText>{t('common.properties')}</TabTitleText>}
            data-testid='pageTopic-tabProperties'
            tabContentId='kafka-ui-TabcontentProperties'
            tabContentRef={contentRefProperties}
          />
          <Tab
            eventKey={3}
            title={<TabTitleText>{t('common.schemas')}</TabTitleText>}
            data-testid='pageTopic-tabSchemas'
            tabContentId='kafka-ui-TabSchemas'
            tabContentRef={contentRefSchemas}
          />
        </Tabs>
      </PageSection>
      <PageSection
        variant={
          activeTabKey === 2
            ? PageSectionVariants.light
            : PageSectionVariants.default
        }
      >
        <TabContent
          eventKey={1}
          id='kafka-ui-TabcontentConsumerGroupList'
          ref={contentRefConsumerGroup}
          className='kafka-ui-m-full-height'
          aria-label='Consumer groups.'
          hidden={activeTabKey != 1}
        >
          <ConsumerGroups
            consumerGroupByTopic={true}
            topic={topicName}
            rowDataTestId='tableTopicConsumers-row'
          />
        </TabContent>
        <TabContent
          eventKey={2}
          id='kafka-ui-TabcontentProperties'
          ref={contentRefProperties}
          className='kafka-ui-m-full-height'
          aria-label='Topic properties.'
          hidden={activeTabKey != 2}
        >
          <TopicDetailView topic={topicDetail} deleteTopic={deleteTopic} />
        </TabContent>
        <TabContent
          eventKey={3}
          id='kafka-ui-TabSchemas'
          ref={contentRefSchemas}
          className='kafka-ui-m-full-height'
          aria-label='Schemas mapping'
          hidden={activeTabKey != 3}
        >
          {showSchemas}
        </TabContent>
      </PageSection>
    </>
  );
};
