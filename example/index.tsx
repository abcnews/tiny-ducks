import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  StateProvider,
  useSelector,
  useAction,
  makeReducer,
  consoleLoggerMiddleware,
  makeStorageMiddleware,
} from '../dist';

type StateOjbect = {
  count: number;
};

// Handle retreval and storage of state
const storageKey = 'counterState';
const initialState: StateOjbect = JSON.parse(
  localStorage.getItem(storageKey) || '{count: 0}'
);
const storeState = state =>
  window.localStorage.setItem(storageKey, JSON.stringify(state));

// A reducer function augmented so we can apply middleware
const reducer = makeReducer((state: StateOjbect, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'INCREMENT_LATER':
      return state;
    default:
      return state;
  }
});

// Apply middleware to the reducer
reducer.use(consoleLoggerMiddleware);
reducer.use(makeStorageMiddleware(storeState));

// Actions
// - Standard
const incrementAction = () => ({ type: 'INCREMENT' });
const decrementAction = () => ({ type: 'DECREMENT' });
// - Async actions are possible by returning a function instead of an action object
const incrementLater = () => dispatch => {
  dispatch({ type: 'INCREMENT_LATER' });
  setTimeout(() => dispatch(incrementAction()), 3000);
};

// Selectors
const countSelector: (state: StateOjbect) => number = state => state.count;

// Reactors
// A reactor is special selecctor which takes the state object and returns either an action
// object or undefined. They can be used to automatically take action depending on state.
// However, be aware that there is a potential for an infinite loop. The state triggering
// the reaction must be removed by the action returned. Don't go async here.
const minZeroReactor = state =>
  state.count < 0 ? incrementAction() : undefined;

// A simple counter component that takes only props
const CounterComponent = ({ count, increment, decrement, later }) => (
  <>
    <div>Count: {count}</div>
    <button onClick={increment}>Increment</button>
    <button onClick={decrement}>Decrement</button>
    <button onClick={later}>Increment later</button>
  </>
);

// A module that hooks up state and functions to the counter component.
const CounterModule = () => (
  <CounterComponent
    {...{
      count: useSelector(countSelector),
      increment: useAction(incrementAction),
      decrement: useAction(decrementAction),
      later: useAction(incrementLater),
    }}
  />
);

// The main app which wraps everything else in the StateProvider
const App = () => {
  return (
    <StateProvider
      initialState={initialState}
      reducer={reducer}
      reactors={[minZeroReactor]}
    >
      <CounterModule />
    </StateProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
