import LoginCard from "../../components/LoginCard/LoginCard";
import styles from "./Signup.module.css"
import { signupFields } from '../../configs/formConfig'
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseurl = "http://localhost:2672/";

const Signup = () => {
    const navigate = useNavigate();
    const [response, setresponse] = useState("");
    const [responseCode,setResponseCode] = useState();


    const handleSignup = async (data) => {
        
        const body = {
            fullName: data.fullName,
            username: data.username,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword
        }
        try {
            // console.log("Sending:", data);

            const response = await axios.post(
                baseurl + 'apis/user/register-user',
                body
            );
            // console.log(response.data);
            setResponseCode(response.status);
            setresponse(response.data);
            // console.log(response.status);
            
            if(response.status==201){
                navigate('/login');
            }

            console.log("Response:", response.data);

        } catch (error) {
            console.log("Status:", error.response?.status);
            console.log("Backend response:", error.response?.data);
            console.log("Full error:", error);
            setresponse(error.response?.status < 500 ? error.response?.data : "Internal server error!");
            setResponseCode(error.response?.status);
        }
        
    }

    return (
        <div className={styles.body}>
            <nav>
                <h1>BookMyShow Clone</h1>
            </nav>
            <LoginCard
                fields={signupFields}
                header="Signup"
                bottomText="Already have an account? "
                bottomLinkText='Login'
                bottomLink='/login'
                onSubmit={handleSignup}
                response={response}
                responseStatus={responseCode}
            />
        </div>
    )
}

export default Signup