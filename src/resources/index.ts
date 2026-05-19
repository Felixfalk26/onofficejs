import type { OnOfficeClient } from '../client/OnOfficeClient.js';
import { ActionId, Module } from '../constants/index.js';
import type {
  AddressReadParams,
  ApiActionResult,
  CalendarReadParams,
  EstateReadParams,
  SearchParams,
  UnlockProviderParams,
} from '../types/index.js';

export class EstateResource {
  constructor(private readonly client: OnOfficeClient) {}

  read(params: EstateReadParams): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Read, Module.Estate, params);
  }

  create(params: Record<string, unknown>): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Create, Module.Estate, params);
  }

  modify(id: string, params: Record<string, unknown>): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Modify, Module.Estate, {
      ...params,
      resourceid: id,
    });
  }

  delete(id: string): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Delete, Module.Estate, { resourceid: id });
  }

  search(input: string, extra: Omit<SearchParams, 'input'> = {}): Promise<ApiActionResult> {
    return this.client.callAsync(ActionId.Get, Module.Estate, null, Module.Search, {
      input,
      ...extra,
    });
  }
}

export class AddressResource {
  constructor(private readonly client: OnOfficeClient) {}

  read(params: AddressReadParams): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Read, Module.Address, params);
  }

  create(params: Record<string, unknown>): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Create, Module.Address, params);
  }

  modify(id: string, params: Record<string, unknown>): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Modify, Module.Address, {
      ...params,
      resourceid: id,
    });
  }

  delete(id: string): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Delete, Module.Address, { resourceid: id });
  }
}

export class CalendarResource {
  constructor(private readonly client: OnOfficeClient) {}

  read(params: CalendarReadParams): Promise<ApiActionResult> {
    return this.client.callAsync(ActionId.Read, '', null, Module.Calendar, params);
  }
}

export class MarketplaceResource {
  constructor(private readonly client: OnOfficeClient) {}

  unlockProvider(params: UnlockProviderParams): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Do, Module.UnlockProvider, params);
  }
}

export class SearchCriteriaResource {
  constructor(private readonly client: OnOfficeClient) {}

  read(params: Record<string, unknown>): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Read, Module.SearchCriteria, params);
  }

  create(params: Record<string, unknown>): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Create, Module.SearchCriteria, params);
  }

  modify(id: string, params: Record<string, unknown>): Promise<ApiActionResult> {
    return this.client.callGenericAsync(ActionId.Modify, Module.SearchCriteria, {
      ...params,
      resourceid: id,
    });
  }
}

export interface ResourceBundle {
  estates: EstateResource;
  addresses: AddressResource;
  calendar: CalendarResource;
  marketplace: MarketplaceResource;
  searchCriteria: SearchCriteriaResource;
}

export function createResources(client: OnOfficeClient): ResourceBundle {
  return {
    estates: new EstateResource(client),
    addresses: new AddressResource(client),
    calendar: new CalendarResource(client),
    marketplace: new MarketplaceResource(client),
    searchCriteria: new SearchCriteriaResource(client),
  };
}
