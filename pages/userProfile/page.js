'use client';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { AiOutlineLogout } from "react-icons/ai";


export default function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    userName: '',
    email: '',
    edu: '',
    skill: '',
    exp: '',
    profileimg: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('jwt');

      if (!token) {
        router.push('/login/page');
        return;
      } 

      try {
        const response = await fetch('http://127.0.0.1:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }); 

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        console.log(userData)
        // If profile image is a relative URL, prepend the base URL of your Strapi server
        const profileimgUrl = `http://127.0.0.1:1337/uploads/${userData.profileimg}`
          

        setProfileData({
          userName: userData.username, // Adjust based on your API response
          email: userData.email,
          edu: userData.edu || 'edu not provided',
          skill: userData.skill || 'Company name not provided',
          exp: userData.exp || 'Company name not provided',
          profileimg: profileimgUrl
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('jwt');
    router.push('/login/page');
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="">
       <div className=''>
      <nav className="flex justify-between items-center px-10 py-5 ">
        {/* Display the user's name */}
        <h1 className="font-bold capitalize text-2xl">
          {profileData?.userName || "User"}
        </h1>

        {/* Navigation Links */}
        <ul className="flex gap-5 pr-10">
          <li className="cursor-pointer hover:underline">
            <a href="/allJobs/page">All Jobs</a>
          </li>
          <li className="cursor-pointer hover:underline">
            <a href="/cv/page">Upload CV</a>
          </li>
          <li className="cursor-pointer hover:underline">
            <a href="/updateUser/page">Update Profile</a>
          </li>
          <li className="cursor-pointer hover:underline">
            <a href="/applied-jobs">Applied Jobs</a>
          </li>
        </ul>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition duration-300"
        >
          <AiOutlineLogout className="mr-2" /> Logout
        </button>
      </nav>
    </div>
    <div className="flex min-h-screen">
  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#629da3]">
    <h1 className="text-2xl font-semibold text-white text-center mb-4">
    One application could change everything. Start your journey today!    </h1>
    <button 
      className="flex items-center px-4 py-2 text-white bg-black rounded hover:bg-gray-800 transition duration-300"
    ><a href="/allJobs/page"> All job</a>
     
    </button>
  </div>
  <div className="w-1/2">
    <img src="/04.png" alt="Inspiring Hiring" className=" object-cover" />
  </div>
</div>

    </div>
  );
}

{/* <div className="bg-white rounded-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-bold font-mono text-2xl mb-4">User Profile</h1>

          <div className="flex flex-col items-center">
            <img 
              src={profileData.profileimg} 
              alt="Profile" 
              className="w-48 h-48 rounded-full mb-4 object-cover"
            />
            <h2 className="font-semibold text-xl mb-2">Welcome, {profileData.userName}!</h2>
            <p className=" mb-2"><span className=' font-bold underline'>Email :</span>   {profileData.email}</p>
            <p className=" mb-2"><span className=' font-bold underline'>Education :</span>   {profileData.edu}</p>
            <p className=" mb-6"><span className=' font-bold underline'>Skills :</span>   {profileData.skill}</p>
            <p className=" mb-6"><span className=' font-bold underline'>Experience :</span>   {profileData.exp}</p>

          </div>
        </div>
        <div className='flex gap-4 pb-2'>
          <div className="flex-1">
            <a href='/update/page'>
              <button className="w-full bg-[#629da3] text-white font-semibold py-2 rounded hover:bg-[#507a7d] transition duration-200">
                Update Profile
              </button>
            </a>
          </div>
          <div className="flex-1">
            <a href='/job/page'>
              <button className="w-full bg-[#629da3] text-white font-semibold py-2 rounded hover:bg-[#507a7d] transition duration-200">
                GO TO JobPortal
              </button>
            </a>
          </div>
        </div>
        <div className="text-center">
          <button 
            onClick={logout} 
            className="w-full bg-[#629da3] text-white font-semibold py-2 rounded hover:bg-[#507a7d] transition duration-200"
          >
            Logout
          </button>
        </div>
      </div> */}