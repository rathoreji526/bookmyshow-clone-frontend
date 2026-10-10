import LoginCard from "../../components/LoginCard/LoginCard"
import styles from "./Login.module.css"
import { loginFields } from '../../configs/formConfig';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const baseurl = "http://localhost:2672/";

const Login = () => {

  const [response, setResponse] = useState("");
  const [responseCode, setResponseCode] = useState();
  const navigate = useNavigate();

  const handleLogin = async (data) => {

    const body = {
      username: data.username,
      password: data.password
    }

    try {
      const response = await axios.post(
        baseurl + 'app/login',
        body
      )
    
      setResponse(response.data.message);
      setResponseCode(response.status);
      if(response.status===200){
        localStorage.setItem('token',response.data.token);
        navigate('/');
      }
    }catch(e){
      // console.log(e.response);s
      
      setResponseCode(e.response.data.status);
      setResponse(e.response.data.message);
    }
  }
  return (
    <div className={styles.body}>
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
      />
    </div>
  )
}

export default Login