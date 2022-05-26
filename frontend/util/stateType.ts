export type StateType<T> = StateTypeLoading | StateTypeSuccess<T>;

export interface StateTypeLoading {
  loading: true;
  data: undefined;
}

export interface StateTypeSuccess<T> {
  loading: false;
  data: T;
}
