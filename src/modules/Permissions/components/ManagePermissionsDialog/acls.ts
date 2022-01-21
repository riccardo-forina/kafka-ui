import { Validated } from '@app/modules/Permissions/components/ManagePermissionsDialog/validated';
import {
  AclOperation,
  AclPatternType,
  AclPermissionType,
  AclResourceType,
} from '@rhoas/kafka-instance-sdk';

export const AllAccountsId = '*';

export const isNewAclModified = (value: NewAcls): boolean => {
  const emptyAcl = createEmptyNewAcl();
  const newAcls = Array.isArray(value) ? value : [value];
  return newAcls.some((v) => {
    if (v.aclShortcutType === AclShortcutType.ManageAccess) {
      return true;
    } else if (v.aclShortcutType) {
      return !(
        v.patternType.value === emptyAcl.patternType.value &&
        v.resource.value === emptyAcl.resource.value
      );
    }
    return !(
      v.permission.value === emptyAcl.permission.value &&
      v.patternType.value === emptyAcl.patternType.value &&
      v.resourceType.value === emptyAcl.resourceType.value &&
      v.resource.value === emptyAcl.resource.value &&
      v.operation.value === emptyAcl.operation.value
    );
  });
};

export enum AclShortcutType {
  ConsumeTopic = 'ConsumeTopic',
  ProduceTopic = 'ProduceTopic',
  ManageAccess = 'ManageAccess',
}

export type NewAcl = {
  permission: Validated<AclPermissionType | undefined>;
  operation: Validated<AclOperation | undefined>;
  resourceType: Validated<AclResourceType | undefined>;
  patternType: Validated<AclPatternType | undefined>;
  resource: Validated<string | undefined>;
  aclShortcutType: AclShortcutType | undefined;
  operations?: AclOperation[];
  metaData?: {
    title: string;
    popoverHeader: string;
    popoverBody: string;
    ariaLabel: string;
  };
};

export type NewAcls = NewAcl | NewAcl[];

export const createEmptyNewAcl = (): NewAcl => {
  return {
    permission: {
      value: AclPermissionType.Allow,
    },
    operation: {
      value: undefined,
    },
    resourceType: {
      value: undefined,
    },
    patternType: {
      value: AclPatternType.Prefixed,
    },
    resource: {
      value: undefined,
    },
    aclShortcutType: undefined,
  } as NewAcl;
};

export type CellProps = {
  acl: NewAcl;
  row: number;
  childRow?: number;
};

export type AclCellProps = CellProps & {
  setAcls: React.Dispatch<React.SetStateAction<NewAcls[] | []>>;
  setEscapeClosesModal: (closes: boolean) => void;
  menuAppendTo:
    | HTMLElement
    | (() => HTMLElement)
    | 'parent'
    | 'inline'
    | undefined;
};

export const update2DArrayAcls = (
  prevAcls: NewAcls[],
  newAcl: NewAcl,
  row: number,
  childRow = 0
) => {
  if (Array.isArray(prevAcls[row]) && childRow !== undefined)
    prevAcls[row][childRow] = newAcl;
  else prevAcls[row] = newAcl;
  return prevAcls;
};

export const handle2DArrayAcls = (
  acls: NewAcls[],
  row: number,
  childRow = 0
) => {
  const newAcls = Array.isArray(acls[row]) ? acls[row][childRow] : acls[row];
  return newAcls;
};
