import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Registration from '../Component/Registration'; 
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('text-encoding');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

jest.mock('axios');

jest.mock('../../assets/person1.jpeg', () => '/mocked/person1.jpeg');
jest.mock('../../assets/person2.jpeg', () => '/mocked/person2.jpeg');
jest.mock('../../assets/person3.jpeg', () => '/mocked/person3.jpeg');
jest.mock('../../assets/person4.jpeg', () => '/mocked/person4.jpeg');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }), 
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
    render(<MockRegistration />);
  });

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
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    axios.post.mockResolvedValue({ status: 201 });

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    const profileRadio = document.querySelector('input[name="profileImage"]');
    fireEvent.click(profileRadio);
    const maleRadio = document.querySelector('input[name="gender"][value="male"]');
    fireEvent.click(maleRadio);
    fireEvent.click(screen.getByLabelText(/HR/i));
    fireEvent.change(screen.getByLabelText(/Select Salary/i), { target: { value: '₹10,000' } });
    fireEvent.change(document.querySelector('#day'), { target: { value: '01' } });
    fireEvent.change(document.querySelector('#month'), { target: { value: '01' } });
    fireEvent.change(document.querySelector('#year'), { target: { value: '2025' } });
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: 'New joiner' } });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to add the employee?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/EmpList', {
        name: 'John Doe',
        profileImage: '/Assets/person1.jpeg',
        gender: 'male',
        departments: ['HR'],
        salary: '₹10,000',
        startDate: '01-01-2025',
        notes: 'New joiner',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    alertMock.mockRestore();
  });

  test('handles API failure on submit gracefully', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    axios.post.mockRejectedValue(new Error('API Error'));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    const profileRadio = document.querySelector('input[name="profileImage"]');
    fireEvent.click(profileRadio);
    const maleRadio = document.querySelector('input[name="gender"][value="male"]');
    fireEvent.click(maleRadio);
    fireEvent.click(screen.getByLabelText(/HR/i));
    fireEvent.change(screen.getByLabelText(/Select Salary/i), { target: { value: '₹10,000' } });
    fireEvent.change(document.querySelector('#day'), { target: { value: '01' } });
    fireEvent.change(document.querySelector('#month'), { target: { value: '01' } });
    fireEvent.change(document.querySelector('#year'), { target: { value: '2025' } });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to add the employee?')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Add'));

    alertMock.mockRestore();
  });

  test('resets form fields when Reset button is clicked', () => {
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Reset Test' } });
    const maleRadio = document.querySelector('input[name="gender"][value="male"]');
    fireEvent.click(maleRadio);
    fireEvent.click(screen.getByLabelText(/HR/i));
    fireEvent.change(document.querySelector('#day'), { target: { value: '01' } });
    fireEvent.change(document.querySelector('#month'), { target: { value: '01' } });
    fireEvent.change(document.querySelector('#year'), { target: { value: '2025' } });

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Reset Test');
    expect(maleRadio).toBeChecked();
    expect(screen.getByLabelText(/HR/i)).toBeChecked();
    expect(document.querySelector('#day')).toHaveValue('01');
    expect(document.querySelector('#month')).toHaveValue('01');
    expect(document.querySelector('#year')).toHaveValue('2025');

    fireEvent.click(screen.getByText(/Reset/i));

    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(maleRadio).not.toBeChecked();
    expect(screen.getByLabelText(/HR/i)).not.toBeChecked();
    expect(document.querySelector('#day')).toHaveValue('');
    expect(document.querySelector('#month')).toHaveValue('');
    expect(document.querySelector('#year')).toHaveValue('');
  });

  test('navigates to dashboard when Cancel button is clicked', () => {
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
