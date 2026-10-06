import LoginCard from "../../components/LoginCard/LoginCard"
import styles from "./Login.module.css"
import {loginFields} from '../../configs/formConfig';

const Login = () => {
  return (
    <div className={styles.body}>
        <nav>
            <h1>BookMyShow Clone</h1>
        </nav>
      <LoginCard fields = {loginFields} header = "Login" bottomText='Dont have an account? ' bottomLinkText='Signup' bottomLink='/signup'/>
    </div>
  )
}

export default Login