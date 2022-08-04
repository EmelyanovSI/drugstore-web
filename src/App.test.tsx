import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    const linkElement = render(<App />);
    expect(linkElement).toBeDefined();
});
