import LoginCard from "../../components/LoginCard/LoginCard";
import styles from "./Signup.module.css"
import {signupFields} from '../../configs/formConfig'



const Signup = () => {
    return (
        <div className={styles.body}>
            <nav>
                <h1>BookMyShow Clone</h1>
            </nav>
            <LoginCard fields={signupFields} header = "Signup" bottomText = "Already have an account? " bottomLinkText='Login' bottomLink='/login'/>
        </div>
    )
}

export default Signup