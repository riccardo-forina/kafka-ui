import React, { FunctionComponent } from "react";
import { I18nextProvider } from "react-i18next";
import { AlertVariant } from "@patternfly/react-core";
import { ConfigContext, IConfiguration } from "../../contexts";
import { CreateTopicPage } from "@app/modules/Topics/CreateTopic/CreateTopicPage";
import kafkai18n from "@app/i18n";
import { AlertContext, AlertContextProps } from "@app/contexts/Alert";
import { FederatedProps } from "../../utils";
import "./style.scss";

export interface FederatedCreateTopicProps extends FederatedProps {
  getToken: () => Promise<string>;
  apiBasePath: string;
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInatanceLink?: string;
  onCloseCreateTopic: () => void;
  addAlert: (message: string, variant?: AlertVariant) => void;
}

const FederatedCreateTopic: FunctionComponent<FederatedCreateTopicProps> = ({
  getToken,
  apiBasePath,
  kafkaName,
  kafkaPageLink,
  kafkaInatanceLink,
  onCloseCreateTopic,
  addAlert,
}) => {
  const alertContext = {
    addAlert,
  } as AlertContextProps;
  const setIsCreateTopic = (b: boolean) => {
    if (!b) {
      onCloseCreateTopic();
    }
  };

  return (
    <I18nextProvider i18n={kafkai18n}>
      <ConfigContext.Provider
        value={{ basePath: apiBasePath, getToken } as IConfiguration}
      >
        <AlertContext.Provider value={alertContext}>
          <CreateTopicPage
            setIsCreateTopic={setIsCreateTopic}
            kafkaName={kafkaName}
            kafkaPageLink={kafkaPageLink}
            kafkaInstanceLink={kafkaInatanceLink}
            onCloseCreateTopic={onCloseCreateTopic}
          />
        </AlertContext.Provider>
      </ConfigContext.Provider>
    </I18nextProvider>
  );
};

export { FederatedCreateTopic };

export default FederatedCreateTopic;
