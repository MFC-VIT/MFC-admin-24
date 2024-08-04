import { useEffect } from "react";
import { GrGoogle } from "react-icons/gr";
import { GOOGLE_AUTH_REDIRECT } from "../config";

const Login = () => {
  // Function to initiate Google login
  const googleLogin = () => {
    window.location.href = GOOGLE_AUTH_REDIRECT;
  };

  // Check for JWT token in the URL and set it in local storage
  

  return (
    <main className="h-screen w-full flex justify-center items-center bg-black">
      <div className="flex flex-col items-center rounded-xl border-gray-900 w-[600px] p-6 px-10 gap-5 text-white bg-gray-800">
        <div className="size-14"><img src="/admin-portal-icon-3.png" alt="admin-portal-icon" /></div>
        <div className="text-4xl font-bold">Sign in to Admin Portal</div>
        <div className="text-xl text-center">For a seamless and secure experience, please sign in using your Google account.</div>
        <button className="border border-gray-500 hover:bg-gray-500 rounded-md px-5 py-2 w-[75%] flex items-center justify-center gap-3" onClick={googleLogin}>
          <span><GrGoogle className="size-4" /></span>
          Sign in with Google
        </button>
      </div>
    </main>
  );
};

export default Login;
