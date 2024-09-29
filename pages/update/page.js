"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import updateme from "../../utils/updateme";
import uploadimg from "../../utils/uploadimg";

export default function UpdateProfile() {
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
  const [successMessage, setSuccessMessage] = useState("");

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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        setProfileData({
          userName: userData.username,
          email: userData.email,
          address: userData.address || "",
          companyname: userData.companyname || "",
          profileimg: userData.profileimg || "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProfileData({
      ...profileData,
      profileimg: e.target.files?.[0]?.name ? e.target.files[0] : null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
  
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.push("/login/page");
      return;
    }
  
    try {
      let newFileName;
      if (profileData.profileimg instanceof File) {
        const uploadResponse = await uploadimg(token, profileData.profileimg);
        if (!uploadResponse?.[0]?.hash) {
          return setError("Error during uploading file");
        }
        newFileName = uploadResponse[0].hash + uploadResponse[0].ext;
      }
  
      const tempProfileData = { ...profileData };
      delete tempProfileData.profileimg;
  
      if (newFileName) tempProfileData.profileimg = newFileName;
  
      const updateResponse = await updateme(token, tempProfileData);
  
      if (updateResponse !== "OK") {
        return setError("Failed to update profile details");
      }
  
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };
  

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#629da3] flex items-center justify-center min-h-screen text-black">
      <div className="bg-white rounded-lg w-full max-w-md p-8">
        <h1 className="font-bold font-mono text-2xl mb-4 text-center">
          Update Profile
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              name="userName"
              value={profileData.userName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyname"
              value={profileData.companyname}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Profile Image
            </label>
            <input
              type="file"
              name="profileimg"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded"
            />
            {profileData.profileimg &&
              !(profileData.profileimg instanceof File) && (
                <div className="mt-2">
                  <img
                    src={
                      "http://localhost:1337/uploads/" + profileData.profileimg
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
          </div>

          {successMessage && (
            <div className="text-green-500 mb-4">{successMessage}</div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-[#629da3] text-white font-semibold py-2 rounded hover:bg-[#507a7d] transition duration-200"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => router.push("/profile/page")}
              className="w-full bg-gray-400 text-white font-semibold py-2 rounded hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}