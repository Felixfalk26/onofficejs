/** onOffice SmartML action URNs */
export const ActionId = {
  Read: 'urn:onoffice-de-ns:smart:2.5:smartml:action:read',
  Create: 'urn:onoffice-de-ns:smart:2.5:smartml:action:create',
  Modify: 'urn:onoffice-de-ns:smart:2.5:smartml:action:modify',
  Get: 'urn:onoffice-de-ns:smart:2.5:smartml:action:get',
  Do: 'urn:onoffice-de-ns:smart:2.5:smartml:action:do',
  Delete: 'urn:onoffice-de-ns:smart:2.5:smartml:action:delete',
} as const;

export type ActionId = (typeof ActionId)[keyof typeof ActionId];
