import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import person1 from '../assets/person1.jpeg';
import person2 from '../assets/person2.jpeg';
import person3 from '../assets/person3.jpeg';
import person4 from '../assets/person4.jpeg';
import Header from '../Component/Header';
import axios from 'axios';

const Registration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    profileImage: '',
    gender: '',
    department: [],
    salary: '',
    day: '',
    month: '',
    year: '',
    notes: '',
    isEdit: false,
    isModalOpen: false,
  });

  useEffect(() => {
    if (location.state && location.state.isEdit && location.state.employee) {
      const { employee } = location.state;
      const [day, month, year] = employee.startDate.split('-');
      setFormData({
        id: employee.id,
        name: employee.name,
        profileImage: employee.profileImage,
        gender: employee.gender,
        department: employee.departments,
        salary: employee.salary,
        day,
        month,
        year,
        notes: employee.notes || '',
        isEdit: true,
        isModalOpen: false,
      });
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, profileImage, gender, department, salary, day, month, year, notes, isEdit } = formData;
    const startDate = `${day}-${month}-${year}`;
    const employeeData = { name, profileImage, gender, departments: department, salary, startDate, notes };

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3001/EmpList/${id}`, employeeData);
      } else {
        await axios.post('http://localhost:3001/EmpList', employeeData);
      }
      handleReset();
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error adding employee. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      id: '',
      name: '',
      profileImage: '',
      gender: '',
      department: [],
      salary: '',
      day: '',
      month: '',
      year: '',
      notes: '',
      isEdit: false,
      isModalOpen: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        department: checked
          ? [...prev.department, value]
          : prev.department.filter((dep) => dep !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const { name, profileImage, gender, department, salary, day, month, year, notes, isEdit, isModalOpen } = formData;

  return (
    <div>
      <Header />
      <main className="flex flex-col items-center w-full min-h-screen">
        <div className="w-full bg-gray-100 !p-8 flex-1 justify-center items-center">
          <form
            className="items-center max-w-4xl mx-auto bg-white !p-4 flex flex-col gap-[15px] text-[#42515F]"
            id="employeeForm"
            onSubmit={handleSubmit}
          >
            <div className="w-[80%] max-[550px]:w-[100%]">
              <h2 className="text-3xl font-bold text-[#42515F] capitalize !text-left">
                {isEdit ? 'Update Employee' : 'Employee Payroll Form'}
              </h2>
            </div>
            <div className="min-w-[80%] flex flex-col gap-5 !m-[15px] max-[525px]:w-[100%] max-[525px]:!m-0">
              <div className="flex gap-4 flex-col md:flex-row">
                <label htmlFor="name" className="min-w-[20%] text-left md:text-left text-gray-700 font-medium">
                  Name
                </label>
                <div className="w-full md:w-2/3">
                  <input
                    type="text"
                    required
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleInputChange}
                    pattern="[A-Za-z\s]+"
                    title="Only letters are allowed"
                    placeholder="Enter your full name"
                    className="w-full h-10 p-2 border border-gray-300 rounded 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      transition-all duration-300 ease-in-out 
                      hover:border-blue-300"
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-col md:flex-row">
                <label htmlFor='profileImage' className="min-w-[20%] flex justify-start text-left md:text-right font-medium text-gray-700">
                  Profile Image
                </label>
                <div className="w-full md:w-2/3 flex flex-wrap justify-center md:justify-start gap-4">
                  {[
                    { value: '/Assets/person1.jpeg', src: person2 },
                    { value: '/Assets/person2.jpeg', src: person1 },
                    { value: '/Assets/person3.jpeg', src: person3 },
                    { value: '/Assets/person4.jpeg', src: person4 },
                  ].map((img, index) => (
                    <label
                      key={img.src}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all duration-300"
                    >
                      <input
                      id='profileImage'
                        type="radio"
                        required
                        name="profileImage"
                        value={img.value}
                        checked={profileImage === img.value}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <img
                        src={img.src}
                        alt={`Profile ${index + 1}`}
                        className="w-10 h-10 rounded-full object-cover border-2 transition-all duration-300"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 md:flex-row flex-col">
                <div className="min-w-[20%] text-gray-700 font-medium">
                  Gender
                </div>
                <div className="flex gap-6 md:w-2/3 w-full md:flex-row">
                  {['male', 'female'].map((genderOption) => (
                    <label
                      key={genderOption}
                      className="flex gap-3 items-center"
                      htmlFor={`gender-${genderOption}`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        required
                        data-testid={genderOption}
                        id={`gender-${genderOption}`}
                        value={genderOption}
                        checked={gender === genderOption}
                        onChange={handleInputChange}
                        className="w-5 h-5"
                      />
                      <span>{genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 flex-col md:flex-row">
                <label htmlFor='department' className="flex justify-start min-w-[20%] text-left md:text-right font-medium text-gray-700">
                  Department
                </label>
                <div className="w-[100%] flex gap-4 md:w-[75%] md:flex-row flex-wrap justify-center md:justify-start">
                  {['HR', 'sales', 'finance', 'engineer', 'others'].map((dept) => (
                    <label
                      key={dept}
                      className="flex gap-2 items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all duration-300"
                    >
                      <input
                        id='department'
                        type="checkbox"
                        name="department"
                        required
                        value={dept}
                        checked={department.includes(dept)}
                        onChange={handleInputChange}
                        className="w-5 h-5 border border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span>{dept.charAt(0).toUpperCase() + dept.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 md:flex-row flex-col">
                <label htmlFor="salary" className="min-w-[20%] font-medium text-gray-700">
                  Select Salary
                </label>
                <div className="md:w-2/3 w-full">
                  <select
                    id="salary"
                    name="salary"
                    value={salary}
                    required
                    data
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 h-10 p-2 border border-gray-300 rounded text-[#42515F]"
                  >
                    <option value="" disabled>Select Salary</option>
                    {['₹10,000', '₹20,000', '₹30,000'].map((sal) => (
                      <option key={sal} value={sal}>{sal}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 md:flex-row flex-col">
                <label htmlFor='startDate' className="min-w-[20%] font-medium text-gray-700">Start Date</label>
                <div className="flex gap-4 md:w-2/3 w-full flex-col md:flex-row">
                  <select
                    id="startDate"
                    name="day"
                    value={day}
                    data-testid="day"
                    onChange={handleInputChange}
                    required
                    className="w-full md:w-1/4 h-10 p-2 border border-gray-300 rounded text-[#42515F]"
                  >
                    <option value="" disabled>Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    id="month"
                    name="month"
                 
                    value={month}
                    data-testid="month"
                    onChange={handleInputChange}
                    required
                    className="w-full md:w-1/4 h-10 p-2 border border-gray-300 rounded text-[#42515F]"
                  >
                    <option value="" disabled>Month</option>
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((month, index) => (
                      <option key={month} value={String(index + 1).padStart(2, '0')}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    id="year"
            
                    name="year"
                    data-testid="year"
                    value={year}
                    onChange={handleInputChange}
                    required
                    className="w-full md:w-1/4 h-10 p-2 border border-gray-300 rounded text-[#42515F]"
                  >
                    <option value="" disabled>Year</option>
                    {[2021, 2022, 2023, 2024, 2025].map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 md:flex-row flex-col">
                <label htmlFor="notes" className="min-w-[20%] font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={notes}
                  onChange={handleInputChange}
                  className="w-full md:w-2/3 h-24 border border-gray-300 rounded"
                />
              </div>

              <div className="flex justify-between items-center flex-col md:flex-row gap-4">
                <div className="w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full md:w-auto !px-12 !py-3 border border-gray-400 rounded bg-gray-200 hover:text-white hover:bg-[#F76464]"
                  >
                    Cancel
                  </button>
                </div>
                <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
                  <button
                    type="button"
                    className="w-full md:w-auto !px-12 !py-3 border border-gray-400 rounded bg-gray-200 hover:bg-[#82A70C] hover:text-white"
                    onClick={() => setFormData((prev) => ({ ...prev, isModalOpen: true }))}
                  >
                    {isEdit ? 'Update' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full md:w-auto !px-12 !py-3 border border-gray-400 rounded bg-gray-200 hover:bg-gray-500 hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      {isModalOpen && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"></div>
          <div className="fixed p-8 top-1/2 left-1/2 rounded-md transform -translate-x-1/2 -translate-y-1/2 bg-white z-50">
            <h2 className="text-xl font-bold text-[#42515F]">
              Are you sure you want to {isEdit ? 'Edit' : 'Add'} the employee?
            </h2>
            <div className="flex justify-end gap-4 mt-4">
              <button
                data-testid="modal-cancel"
                onClick={() => setFormData((prev) => ({ ...prev, isModalOpen: false }))}
                className="py-2 px-4 border border-[#969696] rounded cursor-pointer bg-[red] hover:bg-[#707070] text-white hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="py-2 px-4 border border-[#969696] rounded cursor-pointer bg-[#82A70C] hover:bg-[#707070] text-white hover:text-white"
              >
                {isEdit ? 'Edit' : 'Add'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Registration;