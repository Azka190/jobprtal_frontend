'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

    const login = async (event) => {
      event.preventDefault();
      setMessage(null);
      setLoading(true);

    const formData = new FormData(event.target);
    const jsonData = Object.fromEntries(formData);

    if (!jsonData.identifier || !jsonData.password) {
      setMessage('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    };

    try {
      const req = await fetch('http://127.0.0.1:1337/api/auth/local', reqOptions);
      const res = await req.json();

      if (req.status !== 200) {
        setMessage(res.error ? res.error.message : 'An error occurred.');
        setLoading(false);
        return; 
      }

      if (res.jwt && res.user) {
        // Store token in localStorage
        localStorage.setItem('jwt', res.jwt);
      
        // Assuming the response contains a field `isCompany` that tells whether the user is a company or not
        const isCompany = res.user.isCompany; // Example field from the response
      
        setMessage('Login successful.');
      
        // Redirect based on the user's role
        if (isCompany) {
          router.push('/comProfile/page'); // Redirect to company profile page
        } else {
          router.push('/userProfile/page'); // Redirect to user profile page
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#629da3] flex items-center justify-center min-h-screen text-black">
      <div className="bg-white rounded-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-bold font-mono text-2xl">Login</h1>
        </div>
        <form onSubmit={login}>
          <label htmlFor="identifier" className="block p-2 font-semibold">Username/Email</label>
          <input type="text" id="identifier" name="identifier" className="block rounded bg-[#E4ECEE] w-full p-2 mb-4" required />

          <label htmlFor="password" className="block p-2 font-semibold">Password</label>
          <input type="password" id="password" name="password" className="block rounded bg-[#E4ECEE] w-full p-2 mb-4" required />

          <button 
            type="submit" 
            className={`w-full bg-[#629da3] text-white font-semibold py-2 rounded hover:bg-[#507a7d] transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Submit'}
          </button>

          <div className="mt-4 text-center">{message}</div>
        </form>
      </div>
    </div>
  );
}
