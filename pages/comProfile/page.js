"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    userName: "",
    email: "",
    address: "",
    companyname: "",
    profileimg: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]); // State to store job data
  const [message, setMessage] = useState(""); // State for error/success messages

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("jwt");

      if (!token) {
        router.push("/login/page");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:1337/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        console.log(userData);
        const profileimgUrl = `http://127.0.0.1:1337/uploads/${userData.profileimg}`;

        setProfileData({
          userName: userData.username, // Adjust based on your API response
          email: userData.email,
          address: userData.address || "Address not provided",
          companyname: userData.companyname || "Company name not provided",
          profileimg: profileimgUrl,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const fetchJobs = async () => {
    const token = localStorage.getItem('jwt');
    const reqOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const req = await fetch('http://127.0.0.1:1337/api/jobs', reqOptions);
      const res = await req.json();

      if (req.status === 200) {
        setJobs(res.data); // Assuming `res.data` contains the list of jobs
      } else {
        setMessage('Failed to fetch jobs.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchJobs(); // Fetch jobs when the component mounts
  }, []);

  const logout = () => {
    localStorage.removeItem("jwt");
    router.push("/login/page");
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="p-7 font-serif">
        <nav className="flex justify-between">
          <h1 className="capitalize text-2xl pl-10">{profileData.companyname}</h1>
          <ul className="flex gap-5 pr-10">
            <li className="cursor-pointer"><a href="/job/page">Post a job</a></li>
            <li className="cursor-pointer">All jobs</li>
            <li className="cursor-pointer">All Candidates</li>
          </ul>
        </nav>
      </div>
      <div className="flex-1 bg-white rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="font-bold font-mono text-2xl text-black">All Jobs</h1>
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
                <th className="p-4">Updated</th>
                <th className="p-4">Last date</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="items-center text-black">
                    <td className="p-4">{job.attributes.jobtitle}</td>
                    <td className="p-4">{job.attributes.jobtype}</td>
                    <td className="p-4">{job.attributes.education}</td>
                    <td className="p-4">{job.attributes.Industry}</td>
                    <td className="p-4">{job.attributes.Salary}</td>
                    <td className="p-4">{job.attributes.startdate}</td>
                    <td className="p-4">{job.attributes.enddate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center">No jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
          {/* <a href='/comProfile/page'>
            <button className="w-full bg-[#629da3] text-white font-semibold py-2 mt-4 rounded hover:bg-[#507a7d] transition duration-200">Go Back</button>
          </a> */}
        </div>
      </div>
    </div>
  );
}

    // <div className="bg-[#629da3] flex items-center justify-center min-h-screen text-black">
    //   <div className="bg-white rounded-lg w-full max-w-md p-8">
    //     <div className="text-center mb-8">
    //       <h1 className="font-bold font-mono text-2xl mb-4">User Profile</h1>

    //       <div className="flex flex-col items-center">
    //         <img
    //           src={profileData.profileimg}
    //           alt="Profile"
    //           className="w-48 h-48 rounded-full mb-4 object-cover"
    //         />
    //         <h2 className="font-semibold text-xl mb-2">Welcome, {profileData.userName}!</h2>
    //         <p className=" mb-2"><span className=' font-bold underline'>Email :</span>   {profileData.email}</p>
    //         <p className=" mb-2"><span className=' font-bold underline'>Address :</span>   {profileData.address}</p>
    //         <p className=" mb-6"><span className=' font-bold underline'>Company Name :</span>   {profileData.companyname}</p>
    //       </div>
    //     </div>
    //     <div className='flex gap-4 pb-2'>
    //       <div className="flex-1">
    //         <a href='/update/page'>
    //           <button className="w-full bg-[#629da3] text-white font-semibold py-2 rounded hover:bg-[#507a7d] transition duration-200">
    //             Update Profile
    //           </button>
    //         </a>
    //       </div>
    //       <div className="flex-1">
    //         <a href='/job/page'>
    //           <button className="w-full bg-[#629da3] text-white font-semibold py-2 rounded hover:bg-[#507a7d] transition duration-200">
    //             GO TO JobPortal
    //           </button>
    //         </a>
    //       </div>
    //     </div>
    //     <div className="text-center">
    //       <button
    //         onClick={logout}
    //         className="w-full bg-[#629da3] text-white font-semibold py-2 rounded hover:bg-[#507a7d] transition duration-200"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </div>
    // </div>
//   );
// }
