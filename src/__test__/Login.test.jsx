import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Login from '../Component/Login.jsx';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

jest.mock('jwt-decode');
jest.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess }) => (
    <button 
      data-testid="google-login-button"
      onClick={() => onSuccess({ credential: 'mockToken' })}
    >
      Sign in with Google
    </button>
  ),
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login page', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('SSO Login with Google')).toBeInTheDocument();
  });

  test('handles successful Google login', async () => {
    jwtDecode.mockReturnValue({
      name: 'Test User',
      email: 'test@example.com'
    });

    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByTestId('google-login-button');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(localStorage.getItem('userName')).toBe('Test User');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});