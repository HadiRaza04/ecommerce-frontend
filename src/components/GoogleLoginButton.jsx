import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse) => {
    // console.log(credentialResponse,'JHGJHHG');
    try {
        
      const res = await axios.post(
        "http://localhost:3000/google",

        {
          token: credentialResponse.credential,
        }
      );

      localStorage.setItem("token", res.data.token);
      console.log("Login e:", res.data.user);
      

    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
    />
  );
}
export default GoogleLoginButton;