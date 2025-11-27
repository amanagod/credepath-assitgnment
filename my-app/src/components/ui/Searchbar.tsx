"use client";

// components/JobSearchBar.tsx

import React, { useState } from 'react';

// Define the structure for the search form data
export interface SearchFormData {
  searchTerm: string;
  location: string;
}

// Define the props for the component
interface JobSearchBarProps {
  // Optional: A function to handle the search submission
  onSearch?: (data: SearchFormData) => void;
}

const JobSearchBar: React.FC<JobSearchBarProps> = ({ onSearch }) => {
  const [formData, setFormData] = useState<SearchFormData>({
    searchTerm: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(formData);
    }
    // You would typically call an API here to perform the search
    console.log('Searching for jobs:', formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      
      {/* Container for Heading and Search Bar, set to flex */}
      <div className="flex items-center space-x-8"> 
        
        {/* "Jobs for you" Heading */}
        {/* Set min-w-max to prevent the heading from shrinking, matching the design layout */}
        <h2 className="text-3xl font-semibold text-gray-800 min-w-max">
          Jobs for you
        </h2>

        {/* Search Form Container (takes remaining space) */}
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-grow shadow-md rounded-lg overflow-hidden border border-gray-400" // Darker border: border-gray-400
        >
          
          {/* Search Term Input Field */}
          <input
            type="text"
            name="searchTerm"
            placeholder="Search by company, jobs, skills"
            value={formData.searchTerm}
            onChange={handleChange}
            className="flex-grow p-4 text-gray-700 focus:outline-none focus:ring-0 placeholder-gray-500"
          />
          
          {/* Location Input Field */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            // Adjusted location width and border to be darker (border-gray-400)
            className="w-1/4 p-4 text-gray-700 focus:outline-none focus:ring-0 border-l border-gray-400 placeholder-gray-500"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-medium p-4 transition duration-150 ease-in-out w-32 flex-shrink-0"
          >
            Search Jobs
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobSearchBar;