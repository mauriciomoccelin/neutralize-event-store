import permissions from "./permissions.json";

interface IPermission {
  [key: string]: string[];
}

export const getPermissionsFromRole = (role: string) =>
  (permissions as IPermission)[role];

export const hasPermissionForRole = (role: string, permission: string) => {
  if (!role) throw new Error("Invalid token");

  return getPermissionsFromRole(role).includes(permission);
};
