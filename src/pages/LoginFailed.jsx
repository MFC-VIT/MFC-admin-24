import { GOOGLE_AUTH_REDIRECT } from "../config";

const LoginFailed = () => {
  const googleLogin = () => {
    window.location.href = GOOGLE_AUTH_REDIRECT;
    navigate('/blogs');
  };
  return (
    <main className="h-screen w-full flex justify-center items-center bg-black">
      <div className="flex flex-col items-center rounded-xl border-gray-900 w-[600px] p-10 gap-5 text-white bg-gray-800">
        <div className="text-4xl font-bold">Oops, authentication failed!</div>
        <div className="text-xl text-center">Sorry, but there was an issue authenticating your account. Please try again.</div>
        <button className="border border-gray-500 bg-gray-200 text-black hover:bg-gray-500 hover:text-white rounded-md px-5 py-2 w-[50%] flex items-center justify-center gap-3" onClick={googleLogin}>
          Try Again
        </button>
      </div>
    </main>
  )
}

export default LoginFailed
