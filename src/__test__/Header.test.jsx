import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Component/Header';


jest.mock('../assets/logo.jpeg', () => 'mocked-logo');
jest.mock('../assets/User_Icon.png', () => 'mocked-user-icon');


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => render(<MemoryRouter>{component}</MemoryRouter>);

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.clear();
    renderWithRouter(<Header />);
  });

  test('renders EMPLOYEE text', () => {
    expect(screen.getByText('EMPLOYEE')).toBeInTheDocument();
  });

  test('renders PAYROLL text', () => {
    expect(screen.getByText('PAYROLL')).toBeInTheDocument();
  });

  test('renders logo image', () => {
    const logoImage = screen.getByRole('img', { name: /logo/i });
    expect(logoImage).toBeInTheDocument();
  });

  test('opens dropdown when clicking on user icon', () => {
    localStorage.setItem('userName', 'Sparsh');
    renderWithRouter(<Header />); 

    const userIcon = screen.getByRole('img', { name: /user icon/i });
    fireEvent.click(userIcon);

    const dropdown = screen.getByText('Logout');
    expect(dropdown).toBeInTheDocument();
  });

  test('clicking logout removes user data and redirects', () => {
    localStorage.setItem('userName', 'Sparsh');
    renderWithRouter(<Header />); 

    const userIcon = screen.getByRole('img', { name: /user icon/i });
    fireEvent.click(userIcon);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('userName')).toBeNull(); 
    expect(mockNavigate).toHaveBeenCalledWith('/'); 
  });
});