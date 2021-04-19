import {
  PageSection,
  PageSectionVariants,
  Title,
  Switch,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface ICreateTopicProps {
  isSwitchChecked: boolean;
  kafkaName?: string;
  kafkaPageLink?: string;
  kafkaInstanceLink?: string;
  setIsSwitchChecked: (value: boolean) => void;
}

export const CreateTopichead: React.FC<ICreateTopicProps> = ({
  isSwitchChecked,
  setIsSwitchChecked,
  kafkaName,
  kafkaPageLink,
}) => {

  const { t } = useTranslation();

  const mainBreadcrumbs = (
    <Breadcrumb>
      <BreadcrumbItem to={kafkaPageLink ? kafkaPageLink : '#'}>
        Kafka Instances
      </BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        {kafkaName ? kafkaName : 'Kafka Instance Name'}
      </BreadcrumbItem>
      <BreadcrumbItem to='#' isActive>
        {t('createTopic.createTopic')}
      </BreadcrumbItem>
    </Breadcrumb>
  );
  return (
    <>
      <section className='pf-c-page__main-breadcrumb'>
        {mainBreadcrumbs}
      </section>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel='h1' size='2xl'>
          {t('createTopic.createTopic')}
        </Title>
        <br />
        <Switch
          id='simple-switch'
          label={t('createTopic.showAllOptions')}
          labelOff={t('createTopic.showAllOptions')}
          isChecked={isSwitchChecked}
          onChange={setIsSwitchChecked}
          className='create-topic-wizard'
        />
      </PageSection>
    </>
  );
};
