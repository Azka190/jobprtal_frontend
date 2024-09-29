'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Registration() {
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const register = async (event) => {
    event.preventDefault();
    setMessage(null);
    
    const formData = new FormData(event.target);
    const jsonData = Object.fromEntries(formData);

    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    };

    const req = await fetch('http://127.0.0.1:1337/api/auth/local/register', reqOptions);
    const res = await req.json();

    if (res.error) {
      setMessage(res.error.message);
      return;
    }

    if (res.jwt && res.user) {
      setMessage('Successfull registration.');
      router.push('/login/page');
    }
  };

  return (
    <div className="bg-[#629da3] flex items-center justify-center min-h-screen text-black">
      <div className="bg-white rounded-lg w-[900px] p-8">
        <div className="text-center mb-8">
          <h1 className="font-bold font-mono text-2xl">Registration</h1>
        </div>
        <form onSubmit={register}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="username" className="block p-2 font-semibold">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="block rounded bg-[#E4ECEE] w-full p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block p-2 font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="block rounded bg-[#E4ECEE] w-full p-2"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="edu" className="block p-2 font-semibold">
                Education
              </label>
              <input
                type="text"
                id="edu"
                name="edu"
                className="block rounded bg-[#E4ECEE] w-full p-2"
              />
            </div>
            <div>
              <label htmlFor="skill" className="block p-2 font-semibold">
                Skills
              </label>
              <input
                type="text"
                id="skill"
                name="skill"
                className="block rounded bg-[#E4ECEE] w-full p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="exp" className="block p-2 font-semibold">
                Experience
              </label>
              <input
                type="text"
                id="exp"
                name="exp"
                className="block rounded bg-[#E4ECEE] w-full p-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block p-2 font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="block rounded bg-[#E4ECEE] w-full p-2"
              />
            </div>
          </div>

          {/* <div className="mb-4">
            <label htmlFor="password" className="block p-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="block rounded bg-[#E4ECEE] w-full p-2"
              required
            />
          </div> */}

          <button
            type="submit"
            className="w-full bg-[#629da3] text-white font-semibold py-2 rounded hover:bg-[#507a7d] transition duration-200"
          >
            Submit
          </button>

          <div className="mt-4 text-center">{message}</div>
        </form>
      </div>
    </div>
  );

}