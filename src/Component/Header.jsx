import React, { useState } from 'react';
import logo from '../assets/logo.jpeg';
import userIcon from '../assets/User_Icon.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <header className="w-full h-[9.25vh] bg-white relative">
      <div className="flex justify-between items-center px-[5%] h-[100%] pt-[2px]">
        <div className="flex gap-1 items-center">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <a href="/dashboard" className="no-underline">
            <p className="font-bold text-[#82A70C]">EMPLOYEE</p>
            <p className="text-[#42515F] mt-[-8px] font-bold">PAYROLL</p>
          </a>
        </div>
        
        
        {userName && (
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={toggleDropdown}
            >
              <img 
                src={userIcon} 
                alt="User Icon" 
                className="w-8 h-8 cursor-pointer" 
              />
              <span className="text-[#42515F] font-medium hidden md:inline">
                {userName}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="px-4 py-2 text-[#42515F] font-medium border-b border-gray-200 md:hidden">
                  {userName}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-[#42515F] hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;