'use client';

export default function JobEntry({ jobs }) { // Destructure jobs directly from props
  console.log('Received Jobs:', jobs); // Log the jobs received in the component

  // Check if jobs are valid
  const jobData = jobs?.data || []; // Use optional chaining to safely access jobs.data

  return (
    <div className="bg-[#629da3] flex gap-9 min-h-screen p-6 text-black">
      <div className="flex-1 bg-white rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="font-bold font-mono text-2xl">All Jobs</h1>
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
              </tr>
            </thead>
            <tbody>
              {jobData.length > 0 ? (
                jobData.map((job) => (
                  <tr key={job.id} className="items-center">
                    <td className="p-4">{job.attributes.jobtitle}</td>
                    <td className="p-4">{job.attributes.jobtype}</td>
                    <td className="p-4">{job.attributes.education}</td>
                    <td className="p-4">{job.attributes.Industry}</td>
                    <td className="p-4">{job.attributes.Salary}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center">No jobs found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const headers = {
    Authorization: "Bearer 88c101fef5ea09348bb0ae5f96e2e0ffe1581dfada1510a1f1a353ed32f0f1c9b58d6bd56215c865c1d54d581a578a29697f74f81829e7ccd15d597a6228c4801464a4c45073e09dcfcc1187eafbc1f69488c809d5a10aa435bce78d47369d4196412d75322423ed85e9d3d9361d8c9b1abccde1a21b60763342f05afff68bb2"
  };

  try {
    const response = await fetch("http://localhost:1337/api/jobs", { headers });
    
    // Log response status and text for debugging
    console.log('API Response Status:', response.status); // Log the HTTP status code

    if (!response.ok) {
      const errorText = await response.text(); // Read the response as text
      console.error('API Response Error:', errorText); // Log the error text
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jobs = await response.json(); // Parse the JSON response directly
    console.log('Jobs Data:', jobs); // Log the jobs data

    return {
      props: { jobs },
    };
  } catch (error) {
    console.error('Fetch error:', error); // Log the error to the server console
    return {
      props: { jobs: null }, // or handle it as needed
    };
  }
}
