import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const clientId = process.env.VITE_OAUTH_TOKEN;

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const userData = jwtDecode(token);
    const name = userData.name || userData.given_name || "User";

    localStorage.setItem("userName", name);

    navigate("/dashboard");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className='border rounded-[3px] h-[150px] w-[300px] bg-white !py-[10px]'>
          <div className="flex flex-col items-center justify-center flex-grow text-black">
            <h2 className="text-2xl mb-6">SSO Login with Google</h2>
            <div className="bg-white px-4 py-2 rounded">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={(err) => err.message}
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;