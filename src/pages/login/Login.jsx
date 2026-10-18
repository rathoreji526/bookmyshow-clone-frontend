import LoginCard from "../../components/LoginCard/LoginCard"
import styles from "./Login.module.css"
import { loginFields } from '../../configs/formConfig';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";


const baseurl = "https://bookmyshow-backend-o592.onrender.com/";

const Login = ({onSuccessfulLogin}) => {

  const [response, setResponse] = useState("");
  const [responseCode, setResponseCode] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!response) return;

    const timer = setTimeout(() => {
      setResponse(""); 
    }, 5000);

    return () => clearTimeout(timer);
  }, [response]);

  const handleLogin = async (data) => {

    const body = {
      username: data.username,
      password: data.password
    }
    setLoading(true);
    try {
      const response = await axios.post(
        baseurl + 'app/login',
        body
      )

      setResponse(response?.data?.message);
      setResponseCode(response.status);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        onSuccessfulLogin(token);
        navigate('/');
      }
    } catch (e) {
      const responseCode = e.response?.status;
      setResponseCode(responseCode);
      setResponse(responseCode < 500 ? e.response?.data?.message : "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.body}>
      {
        loading && <Loader />
      }
      <nav>
        <h1>BookMyShow Clone</h1>
      </nav>
      <LoginCard
        fields={loginFields}
        header="Login"
        bottomText='Dont have an account? '
        bottomLinkText='Signup'
        bottomLink='/signup'
        onSubmit={handleLogin}
        response={response}
        responseStatus={responseCode}
        loading={loading}
      />
    </div>
  )
}

export default Login