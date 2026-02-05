import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../constraints";

function GoogleLoginButton() {
  const navigator = useNavigate();
  
  const handleSuccess = async (credentialResponse) => {
    // console.log(credentialResponse,'JHGJHHG');
    try {
      const res = await axios.post(
        `${baseURL}/google`,
        {
          token: credentialResponse.credential,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigator('/products');
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