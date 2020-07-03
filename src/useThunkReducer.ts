import { useState, useCallback, useRef } from 'react';
import { ActionObject, ReducerFunction } from './index';

type DispatchFunction = (
  action: Action | DispatchFunction,
  state?: object
) => void;

type Action = ActionObject | DispatchFunction;

export const useThunkReducer = (
  reducer: ReducerFunction,
  initialState: object
): [object, DispatchFunction] => {
  const [hookState, setHookState] = useState(initialState);

  const state = useRef(hookState);
  const getState = useCallback(() => state.current, [state]);
  const setState = useCallback(
    newState => {
      state.current = newState;
      setHookState(newState);
    },
    [state, setHookState]
  );

  const reduce = useCallback(action => reducer(getState(), action), [
    getState,
    reducer,
  ]);

  const dispatch: DispatchFunction = useCallback(
    action =>
      typeof action === 'function'
        ? action(dispatch, getState())
        : setState(reduce(action)),
    [getState, reduce, setState]
  );

  return [hookState, dispatch];
};
