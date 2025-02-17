import React, { useEffect, useState } from 'react';
import { ICell } from '@patternfly/react-table';
import { useTranslation } from 'react-i18next';
import { InfoCircleIcon } from '@patternfly/react-icons';
import {
  AclPatternType,
  AclPermissionType,
  AclResourceType,
} from '@rhoas/kafka-instance-sdk';
import { Label, LabelGroup, Tooltip } from '@patternfly/react-core';
import { EnhancedAclBinding } from '@app/services/acls';
import {
  PrincipalType,
  usePrincipals,
  useAuth,
} from '@rhoas/app-services-ui-shared';
import { sentenceCase } from 'sentence-case';
import { displayName } from '@app/modules/Permissions/utils';
import { useFederated } from '@app/contexts';
import { SolidLabel } from '@app/modules/Permissions/components/ManagePermissionsDialog/SolidLabel';

export type CellBuilder<T extends EnhancedAclBinding> = (
  item: T,
  row: number
) => ICell | string;

const AllAccountsPrincipal: React.FunctionComponent = () => {
  const { t } = useTranslation(['kafkaTemporaryFixMe']);
  return (
    <div>
      <Label variant='outline'>{t('permission.table.all_accounts')}</Label>
    </div>
  );
};

type PrincipalWithTooltipProps = {
  acl: EnhancedAclBinding;
};
const PrincipalWithTooltip: React.FunctionComponent<PrincipalWithTooltipProps> =
  ({ acl }) => {
    const [currentlyLoggedInuser, setCurrentlyLoggedInuser] = useState<
      string | undefined
    >();
    const auth = useAuth();
    const { kafka } = useFederated() || {};

    const principals = usePrincipals()
      .getAllPrincipals()
      .filter((p) => p.id !== currentlyLoggedInuser && p.id !== kafka?.owner);

    const locatedPrincipals = principals.filter((p) => p.id === acl.principal);

    useEffect(() => {
      const getUsername = async () => {
        const username = await auth?.getUsername();
        setCurrentlyLoggedInuser(username);
      };
      getUsername();
    }, [auth]);

    if (locatedPrincipals.length === 1) {
      if (locatedPrincipals[0].principalType === PrincipalType.ServiceAccount) {
        return (
          <Tooltip
            content={
              <div>
                Type: {locatedPrincipals[0].principalType} <br />
              </div>
            }
          >
            <span tabIndex={0}>
              {' '}
              {acl.principal} <InfoCircleIcon color='grey' />
            </span>
          </Tooltip>
        );
      } else {
        return (
          <Tooltip
            content={
              <div>
                Type: {locatedPrincipals[0].principalType} <br />
                Name: {locatedPrincipals[0].displayName} <br />
                Email: {locatedPrincipals[0].emailAddress}
              </div>
            }
          >
            <span tabIndex={0}>
              {' '}
              {acl.principal} <InfoCircleIcon color='grey' />
            </span>
          </Tooltip>
        );
      }
    }
    return <span> {acl.principal}</span>;
  };

export const principalCell: CellBuilder<EnhancedAclBinding> = (item) => {
  if (item.principal === '*') {
    return {
      title: <AllAccountsPrincipal />,
      props: {},
    };
  } else {
    return {
      title: <PrincipalWithTooltip acl={item} />,
      props: {},
    };
  }
};

export const permissionOperationCell: CellBuilder<EnhancedAclBinding> = (
  item
) => {
  return {
    title: (
      <LabelGroup>
        <Label
          variant='outline'
          color={item.permission === AclPermissionType.Deny ? 'red' : undefined}
        >
          {sentenceCase(item.permission)}
        </Label>
        <Label variant='outline'>{sentenceCase(item.operation)}</Label>
      </LabelGroup>
    ),
    props: {},
  } as ICell;
};

export const resourceCell: CellBuilder<EnhancedAclBinding> = (item) => {
  const PatternType: React.FunctionComponent = () => {
    const { t } = useTranslation(['kafkaTemporaryFixMe']);
    if (item.patternType === AclPatternType.Prefixed) {
      return t('permission.cells.pattern_type_prefixed');
    } else {
      return t('permission.cells.pattern_type_literal');
    }
  };
  if (item.resourceType === AclResourceType.Cluster) {
    return {
      title: (
        <div>
          <SolidLabel variant={item.resourceType} />{' '}
          {displayName(item.resourceType)}
        </div>
      ),
    };
  } else {
    return {
      title: (
        <div>
          <SolidLabel variant={item.resourceType} />{' '}
          {displayName(item.resourceType)} <PatternType /> "{item.resourceName}"
        </div>
      ),
    };
  }
};
