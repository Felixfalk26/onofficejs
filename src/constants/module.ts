/** Common onOffice API module / resource type names */
export const Module = {
  Address: 'address',
  Estate: 'estate',
  SearchCriteria: 'searchcriteria',
  Calendar: 'calendar',
  Task: 'task',
  Search: 'search',
  UnlockProvider: 'unlockProvider',
  File: 'file',
  FieldConfig: 'fieldconfig',
  EstateCategories: 'estateCategories',
  AgentLog: 'agentlog',
} as const;

export type Module = (typeof Module)[keyof typeof Module];
