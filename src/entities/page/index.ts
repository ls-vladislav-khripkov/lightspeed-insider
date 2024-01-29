export enum DeveloperPortalPage {
  Main = '/',
  Requests = '/requests',
  CreateRequest = '/requests/create',
  ViewRequest = '/requests/$request_id',
  RequestChanges = '/requests/$request_id/changes',
  Clients = '/oauth-clients',
  ViewClient = '/oauth-clients/$client_id',
  CreateClient = '/oauth-clients/create',
  CreateUser = '/users/create',
}

export enum DeveloperPortalServerPage {
  Logout = '/auth/logout',
  PostLogout = '/auth/post-logout',
}

export type BackButtonType = {
  to: string;
  text: string;
};
