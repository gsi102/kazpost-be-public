type MetaData = {
  href: string;
  metadataHref: string;
  type: string;
  mediaType: string;
};

const enum OrderStateType {
  Regular = "Regular",
  Successful = "Successful",
  Unsuccessful = "Unsuccessful",
}

type OrderState = {
  meta: MetaData;
  id: string;
  accountId: string;
  name: string;
  color: number;
  stateType: OrderStateType;
  entityType: string;
};
type DemandState = OrderState;
type MoveState = OrderState;
type ReturnState = OrderState;

type EntityState = OrderState | DemandState | MoveState | ReturnState;

export type { OrderState, DemandState, MoveState, ReturnState, EntityState };
