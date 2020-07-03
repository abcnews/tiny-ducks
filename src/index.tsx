import React, { createContext, useContext } from 'react';
import { useThunkReducer } from './useThunkReducer';

export interface ActionObject {
  type: string;
}

export type ReducerFunction = (state: object, action: ActionObject) => object;

type ReactorFunction = (state: object) => ActionObject | undefined;

type MiddlewareFunction = (
  state: object,
  action: ActionObject,
  next: ReducerFunction
) => object;

interface AugmentableReducerFunction extends ReducerFunction {
  use: (fn: MiddlewareFunction) => void;
}

interface StateProviderProps {
  reducer: ReducerFunction;
  reactors?: ReactorFunction[];
  initialState: object;
  children: any;
}

const StateContext = createContext<any[]>(undefined!);

export const StateProvider = ({
  reducer,
  reactors = [],
  initialState,
  children,
}: StateProviderProps) => {
  const [state, dispatch] = useThunkReducer(reducer, initialState);

  // Reactors
  let nextReaction;
  reactors.some(reactor => {
    nextReaction = reactor(state) || false;
    return !nextReaction;
  });

  // If we found something dispatch it.
  // It might be tempting to wait for idle to do this, but that creates a potentially infinite loop—the whole reactors
  // system relies on the dispatch of nextReaction immediately (in this loop) removing the criteria that got it selected
  // in the first place. If that doesn't happen it keeps getting called.
  if (nextReaction) {
    dispatch(nextReaction);
  }

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

// Direct access to the state and dispatcher
export const useStateValue = () => useContext(StateContext);

// Access to the state via a selector function (e.g. functions created using a package like reselect)
export const useSelector = (
  selector: (state: object, props: object) => any,
  ...props: any[]
) => {
  const [state] = useStateValue();
  return selector(state, props);
};

// Run an action function
// Action functions typically return an action object to be dispatched, however, they may also
// return a function. This enables the possibility of creating reactors (selectors which will
// dispatch an action whenever certain criteria are met).
// See: https://read.reduxbook.com/markdown/part2/10-reactive-state.html
export const useAction = (action: (...args: any[]) => void) => {
  const [, dispatch] = useStateValue();
  return (...args: any[]) => dispatch(action(...args));
};

// Takes a standard reducer function and gives it a `.use()` method for applying middleware.
export const makeReducer = (
  reducer: ReducerFunction = state => state
): AugmentableReducerFunction => {
  let go = reducer;

  const start = (state: object, action: ActionObject) => go(state, action);

  start.use = (fn: MiddlewareFunction) => {
    const next = go;
    go = (state, action) => fn(state, action, next);
  };

  return start;
};

// A simple console logger middleware
export const consoleLoggerMiddleware: MiddlewareFunction = (
  state,
  action,
  next
) => {
  console.group('Dispatch');
  console.log('state', state);
  console.log('action', action);
  const nextState = next(state, action);
  console.log('nextState', nextState);
  console.groupEnd();
  return nextState;
};

// A factory method for storage middleware
export const makeStorageMiddleware: (
  saveState: (state: object) => void
) => MiddlewareFunction = saveState => (state, action, next) => {
  const nextState = next(state, action);
  saveState(nextState);
  return nextState;
};
