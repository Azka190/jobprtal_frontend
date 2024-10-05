'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function JobEntry() {
  const [message, setMessage] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    salary: '',
    jobType: '',
    education: '',
    industry: '',
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      router.push('/login/page'); // Redirect if not logged in
    } else {
      fetchUserId(token);
    }
  }, []);

  const fetchUserId = async (token) => {
    try {
      const res = await fetch('http://127.0.0.1:1337/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setUserId(data.id);
        fetchJobs(data.id);
      } else {
        setMessage('Failed to fetch user information.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const fetchJobs = async (userId) => {
    const token = localStorage.getItem('jwt');
    try {
      const res = await fetch(`http://127.0.0.1:1337/api/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setJobs(data.data);
        setFilteredJobs(data.data); // Initialize filteredJobs
      } else {
        setMessage('Failed to fetch jobs.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const applyForJob = async (jobId, userId) => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setMessage("You need to be logged in to apply for a job.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:1337/api/applications", 
        {
          data: {
            JobId: String(jobId),
            jobs: jobId,
            users_permissions_users: userId,
            applicationDate: new Date().toISOString(),
            Status: "pending",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Add JWT token in headers
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error applying for job:", error.response?.data || error.message);
      throw new Error(
        "Failed to apply for the job: " + (error.response?.data?.message || error.message)
      );
    }
  };
  

  const handleApply = async (jobId) => {
    if (!userId) {
      setMessage('User ID is not available. Please try refreshing.');
      return;
    }
  
    try {
      await applyForJob(jobId, userId);
      setMessage('You have successfully applied for this job. Your application is under process.');
    } catch (error) {
      setMessage('Failed to apply for the job. Please try again.');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterJobs(e.target.value, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    filterJobs(searchQuery, { ...filters, [name]: value });
  };

  const filterJobs = (search, filters) => {
    let filtered = jobs;

    if (search) {
      filtered = filtered.filter((job) =>
        job.attributes.jobtitle.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filters.jobType) {
      filtered = filtered.filter((job) => job.attributes.jobtype === filters.jobType);
    }

    if (filters.education) {
      filtered = filtered.filter((job) => job.attributes.education === filters.education);
    }

    if (filters.industry) {
      filtered = filtered.filter((job) => job.attributes.Industry === filters.industry);
    }

    setFilteredJobs(filtered);
  };

  return (
    <div className="bg-[#629da3] flex gap-9 min-h-screen p-10 text-black">
      <div className="flex-1 bg-white rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="font-bold font-mono text-2xl">All Jobs</h1>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Search jobs by title"
            value={searchQuery}
            onChange={handleSearch}
            className="border p-2 rounded-md shadow-sm"
          />

         

          <select
            name="jobType"
            value={filters.jobType}
            onChange={handleFilterChange}
            className="border p-2 rounded-md shadow-sm"
          >
            <option value="">Select Job Type</option>
            <option value="Contract">Contract</option>
            <option value="Permanent">Permanent</option>
          </select>

          <select
            name="education"
            value={filters.education}
            onChange={handleFilterChange}
            className="border p-2 rounded-md shadow-sm"
          >
            <option value="">Select Education</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
          </select>

          <select
            name="industry"
            value={filters.industry}
            onChange={handleFilterChange}
            className="border p-2 rounded-md shadow-sm"
          >
            <option value="">Select Industry</option>
            <option value="Business">Business</option>
            <option value="Banking">Banking</option>
            <option value="Education">Education</option>
            <option value="Telecommunication">Telecommunication</option>
            <option value="IT">IT</option>
          </select>
        </div>

        <div>
          <table className="w-full bg-[#E4ECEE] border border-gray-300 rounded-lg items-center">
            <thead>
              <tr className="bg-[#629da3] text-white">
                <th className="p-4">Job Title</th>
                <th className="p-4">Job Type</th>
                <th className="p-4">Education</th>
                <th className="p-4">Industry</th>
                <th className="p-4">Salary</th>
                <th className="p-4">uploaded Date</th>
                <th className="p-4">end Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="p-4">{job.attributes.jobtitle}</td>
                    <td className="p-4">{job.attributes.jobtype}</td>
                    <td className="p-4">{job.attributes.education}</td>
                    <td className="p-4">{job.attributes.Industry}</td>
                    <td className="p-4">{job.attributes.Salary}</td>
                    <td className="p-4">{job.attributes.startdate}</td>
                    <td className="p-4">{job.attributes.enddate}</td>
                    <td className="p-4">
                      <button 
                      onClick={ () => handleApply (job.id)}
                      className="border border-black px-3 py-1">Apply</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center">No jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <a href="/userProfile/page">
            <button className="w-full bg-[#629da3] text-white font-semibold py-2 mt-4 rounded hover:bg-[#507a7d] transition duration-200">
              Go Back
            </button>
          </a>
          {message && (
      <div className=" text-center text-green-500 pt-9 mb-1">
        {message}
      </div>
    )}
        </div>
      </div>
      
    </div>
  );
}
