import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Registration from '../Component/Registration';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

// Polyfill for older Node versions (optional, remove if not needed)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('text-encoding');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

jest.mock('axios');

// Mock image imports
jest.mock('../../assets/person1.jpeg', () => '/mocked/person1.jpeg');
jest.mock('../../assets/person2.jpeg', () => '/mocked/person2.jpeg');
jest.mock('../../assets/person3.jpeg', () => '/mocked/person3.jpeg');
jest.mock('../../assets/person4.jpeg', () => '/mocked/person4.jpeg');

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockLocation = { state: null };
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

const MockRegistration = () => (
  <BrowserRouter>
    <Registration />
  </BrowserRouter>
);

describe('Registration Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.state = null; // Reset mockLocation state
    render(<MockRegistration />);
  });

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Profile 1' })); // Match exact alt text
    fireEvent.click(screen.getByTestId("male")); // Should work with fixed component
    fireEvent.click(screen.getByLabelText('HR')); // Exact match for checkbox label
    fireEvent.change(screen.getByLabelText(/Select Salary/i), { target: { value: '₹10,000' } });
    fireEvent.change(screen.getByTestId(/day/i), { target: { value: '01' } });
    fireEvent.change(screen.getByTestId(/month/i),{ target: { value: '01' } });
    fireEvent.change(screen.getByTestId(/year/i), { target: { value: '2025' } });
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: 'New joiner' } });
  };

  test('renders form fields correctly', () => {
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText(/Department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Salary/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
  });

  test('submits form successfully when all fields are valid', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    axios.post.mockResolvedValue({ status: 201 });
    fillForm();
    fireEvent.click(screen.getByText(/Submit/i));
    await waitFor(() => expect(screen.getByText('Are you sure you want to Add the employee?')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Add'));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/EmpList', expect.objectContaining({
        name: 'John Doe',
        gender: 'male',
        salary: '₹10,000',
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles API failure on submit gracefully', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    axios.post.mockRejectedValue(new Error('API Error'));
    fillForm();
    fireEvent.click(screen.getByText(/Submit/i));
    await waitFor(() => expect(screen.getByText('Are you sure you want to Add the employee?')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Add'));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Error adding employee. Please try again.'));
  });

  test('resets form fields when Reset button is clicked', () => {
    fillForm();
    fireEvent.click(screen.getByText(/Reset/i));
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(screen.getByTestId("male")).not.toBeChecked();
    expect(screen.getByLabelText('HR')).not.toBeChecked();
    expect(screen.getByTestId(/day/i)).toHaveValue('');
    expect(screen.getByTestId(/month/i)).toHaveValue('');
    expect(screen.getByTestId(/year/i)).toHaveValue('');
    expect(screen.getByLabelText(/Notes/i)).toHaveValue('');
  });

  test('navigates to dashboard when Cancel button is clicked', () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  // test('pre-fills form fields when editing an employee', () => {
  //   mockLocation.state = {
  //     isEdit: true,
  //     employee: {
  //       id: 1,
  //       name: 'Jane Doe',
  //       profileImage: '/Assets/person1.jpeg',
  //       gender: 'female',
  //       departments: ['HR', 'sales'],
  //       salary: '₹20,000',
  //       startDate: '15-03-2023',
  //       notes: 'Experienced hire',
  //     },
  //   };
  //   render(<MockRegistration />);
  //   expect(screen.getByLabelText(/Name/i)).toHaveValue('Jane Doe');
  //   expect(screen.getByRole('radio', { name: 'Profile 1' })).toBeChecked();
  //   expect(screen.getByRole('radio', { name: /female/i })).toBeChecked();
  //   expect(screen.getByLabelText('HR')).toBeChecked();
  //   expect(screen.getByLabelText('Sales')).toBeChecked();
  //   expect(screen.getByLabelText(/Select Salary/i)).toHaveValue('₹20,000');
  //   expect(screen.getByLabelText(/day/i, { selector: '#day' })).toHaveValue('15');
  //   expect(screen.getByLabelText(/month/i, { selector: '#month' })).toHaveValue('03');
  //   expect(screen.getByLabelText(/year/i, { selector: '#year' })).toHaveValue('2023');
  //   expect(screen.getByLabelText(/Notes/i)).toHaveValue('Experienced hire');
  //   expect(screen.getByText('Update Employee')).toBeInTheDocument();
  // });

  // test('updates employee successfully in edit mode', async () => {
  //   jest.spyOn(window, 'alert').mockImplementation(() => {});
  //   mockLocation.state = {
  //     isEdit: true,
  //     employee: { id: 1, name: 'Jane Doe', startDate: '15-03-2023' },
  //   };
  //   render(<MockRegistration />);
  //   axios.put.mockResolvedValue({ status: 200 });
  //   fillForm();
  //   fireEvent.click(screen.getByText(/Update/i));
  //   await waitFor(() => expect(screen.getByText('Are you sure you want to Edit the employee?')).toBeInTheDocument());
  //   fireEvent.click(screen.getByText('Edit'));
  //   await waitFor(() => {
  //     expect(axios.put).toHaveBeenCalledWith('http://localhost:3001/EmpList/1', expect.objectContaining({
  //       name: 'John Doe',
  //       gender: 'male',
  //     }));
  //     expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  //   });
  // });

  test('closes modal when Cancel is clicked in confirmation', async () => {
    fillForm();
    fireEvent.click(screen.getByText(/Submit/i));
    await waitFor(() => expect(screen.getByText('Are you sure you want to Add the employee?')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId(/cancel/i)); // Modal Cancel button
    await waitFor(() => expect(screen.queryByText('Are you sure you want to Add the employee?')).not.toBeInTheDocument());
  });

  test('handles department checkbox selection and deselection', () => {
    const hrCheckbox = screen.getByLabelText('HR');
    const salesCheckbox = screen.getByLabelText('Sales');
    
    fireEvent.click(hrCheckbox);
    expect(hrCheckbox).toBeChecked();

    fireEvent.click(salesCheckbox);
    expect(salesCheckbox).toBeChecked();

    fireEvent.click(hrCheckbox);
    expect(hrCheckbox).not.toBeChecked();
    expect(salesCheckbox).toBeChecked();
  });

  test('shows browser validation for required fields', () => {
    fireEvent.click(screen.getByText(/Submit/i));
    const nameInput = screen.getByLabelText(/Name/i);
    expect(nameInput).toHaveAttribute('required');
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('updates profile image when a new option is selected', () => {
    const person1Radio = screen.getByRole('radio', { name: 'Profile 1' });
    const person2Radio = screen.getByRole('radio', { name: 'Profile 2' });
    
    fireEvent.click(person1Radio);
    expect(person1Radio).toBeChecked();
    
    fireEvent.click(person2Radio);
    expect(person2Radio).toBeChecked();
    expect(person1Radio).not.toBeChecked();
  });
});