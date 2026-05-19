/** onOffice relation type URNs for estate ↔ address links */
export const RelationType = {
  Buyer: 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:buyer',
  Tenant: 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:renter',
  Owner: 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:owner',
  /** Contact person acting as broker */
  ContactBroker: 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:contactPerson',
  /**
   * Returns every contact person — not just brokers.
   * Use {@link RelationType.ContactBroker} when you only need brokers.
   */
  ContactPersonAll: 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:contactPersonAll',
  /** Units of a complex (parent complex → child estates) */
  ComplexEstateUnits: 'urn:onoffice-de-ns:smart:2.5:relationTypes:complex:estate:units',
  /** Owner link (estate parent → address child) */
  EstateAddressOwner: 'urn:onoffice-de-ns:smart:2.5:relationTypes:estate:address:owner',
} as const;

export type RelationType = (typeof RelationType)[keyof typeof RelationType];
