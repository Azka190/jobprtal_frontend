'use client';

export default function JobEntry(props ) {
 

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
            {props.jobs.data.map((item) => {
        return(
                <tr className='items-center '>
                    <td className="p-4">{item.attributes.jobtitle}</td>
                    <td className="p-4">{item.attributes.jobtype}</td>
                    <td className="p-4">{item.attributes.education}</td>
                    <td className="p-4">{item.attributes.Industry}</td>
                    <td className="p-4">{item.attributes.Salary}</td>
                </tr>
                )})}
            </tbody>
        </table>
         
        </div>
    </div>
</div>


  );
}
export async function getServerSideProps(context) {
    let headers = {Authorization: "Bearer 88c101fef5ea09348bb0ae5f96e2e0ffe1581dfada1510a1f1a353ed32f0f1c9b58d6bd56215c865c1d54d581a578a29697f74f81829e7ccd15d597a6228c4801464a4c45073e09dcfcc1187eafbc1f69488c809d5a10aa435bce78d47369d4196412d75322423ed85e9d3d9361d8c9b1abccde1a21b60763342f05afff68bb2"}
    let a = await fetch("http://localhost:1337/api/jobs", {headers : headers})
    let jobs = await a.json()
    return{
      props:{ jobs : jobs},
    }
  }