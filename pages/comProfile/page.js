"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";

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
    const token = localStorage.getItem("jwt");
    const reqOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const req = await fetch("http://127.0.0.1:1337/api/jobs", reqOptions);
      const res = await req.json();

      if (req.status === 200) {
        setJobs(res.data); // Assuming res.data contains the list of jobs
      } else {
        setMessage("Failed to fetch jobs.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
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
      <div className="p-7 font-serif shadow-md">
        <nav className="flex justify-between items-center">
          <h1 className="capitalize text-2xl pl-10">
            {profileData.companyname}
          </h1>

          <ul className="flex gap-5 pr-10">
            <li className="cursor-pointer hover:underline">
              <a href="/job/page">Post a job</a>
            </li>
            <li className="cursor-pointer hover:underline"><a href="/update/page">Update</a></li>
            <li className="cursor-pointer hover:underline">All Candidates</li>
          </ul>

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
      Unlock potential by posting jobs that inspire. Your next great hire is just a click away!
    </h1>
    <button 
      className="flex items-center px-4 py-2 text-white bg-black rounded hover:bg-gray-800 transition duration-300"
    ><a href="/job/page"> Post a job</a>
     
    </button>
  </div>
  <div className="w-1/2">
    <img src="/03.png" alt="Inspiring Hiring" className=" object-cover" />
  </div>
</div>


      
    </div>
  );
}
