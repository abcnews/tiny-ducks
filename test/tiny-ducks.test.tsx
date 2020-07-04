import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StateProvider } from '../src';

describe('StateProvider', () => {
  describe('it', () => {
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(
        <StateProvider initialState={{}} reducer={state => state}>
          <div />
        </StateProvider>,
        div
      );
      ReactDOM.unmountComponentAtNode(div);
    });
  });
});
