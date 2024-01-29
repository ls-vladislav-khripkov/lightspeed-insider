export enum ActionResponseType {
  Success = 'success',
  Error = 'error',
}

export type FetcherResponse = {
  type: ActionResponseType;
} | null;
