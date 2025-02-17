import React, { FunctionComponent } from 'react';
import { TopicDetailPage } from '@app/modules/Topics/pages/TopicDetail';
import {
  ConfigContext,
  FederatedContext,
  FederatedProps,
  IConfiguration,
} from '@app/contexts';
import { KafkaModalLoader } from '@app/components/KafkaModal';
import { ModalProvider } from '@rhoas/app-services-ui-components';

export type TopicDetailFederatedProps = FederatedProps &
  IConfiguration & {
    apiBasePath: string;
  };

const TopicDetailFederated: FunctionComponent<TopicDetailFederatedProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  onError,
  kafkaPageLink,
  kafkaInstanceLink,
  showSchemas,
}) => {
  return (
    <ConfigContext.Provider value={{ basePath: apiBasePath, getToken }}>
      <FederatedContext.Provider
        value={{
          kafka: {},
          activeTab: 2,
          onError,
          kafkaName,
          kafkaPageLink,
          kafkaInstanceLink,
          showSchemas,
        }}
      >
        <ModalProvider>
          <TopicDetailPage />
          <KafkaModalLoader />
        </ModalProvider>
      </FederatedContext.Provider>
    </ConfigContext.Provider>
  );
};

export default TopicDetailFederated;
