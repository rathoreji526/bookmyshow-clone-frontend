import LoginCard from "../../components/LoginCard/LoginCard";
import styles from "./Signup.module.css"
import { signupFields } from '../../configs/formConfig'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const baseurl = "https://bookmyshow-backend-o592.onrender.com/";

const Signup = () => {
    const navigate = useNavigate();
    const [response, setResponse] = useState("");
    const [responseCode, setResponseCode] = useState();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!response) return;

        const timer = setTimeout(() => {
            setResponse("");

        }, 5000);

        return () => clearTimeout(timer);
    }, [response]);


    const handleSignup = async (data) => {

        const body = {
            fullName: data.fullName,
            username: data.username,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword
        }
        setLoading(true);
        try {

            const response = await axios.post(
                baseurl + 'apis/user/register-user',
                body
            );
            setResponseCode(response.status);
            setResponse(response.data);

            if (response.status == 201) {
                navigate('/login');
            }


        } catch (error) {
            setResponse(error.response?.status < 500 ? error.response?.data : "Internal server error!");
            setResponseCode(error.response?.status);
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
                fields={signupFields}
                header="Signup"
                bottomText="Already have an account? "
                bottomLinkText='Login'
                bottomLink='/login'
                onSubmit={handleSignup}
                response={response}
                responseStatus={responseCode}
                loading={loading}
            />
        </div>
    )
}

export default Signup