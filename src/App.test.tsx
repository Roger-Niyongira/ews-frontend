jest.mock('./components/Dashboard/Body', () => () => <div>Mock Body</div>);
jest.mock('./components/PlanningPage', () => () => <div>Mock Planning Page</div>);

import React from 'react';
import axios from 'axios';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const mockedAxios = axios as jest.Mocked<typeof axios>;

test('renders app without crashing', async () => {
  mockedAxios.get.mockResolvedValue({ data: {} });

  render(
    <MemoryRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </MemoryRouter>
  );

  expect(await screen.findByText('Mock Body')).toBeInTheDocument();
});
