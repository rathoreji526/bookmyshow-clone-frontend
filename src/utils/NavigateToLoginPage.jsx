import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import Notification from "../components/notification/Notification";


const NavigateToLoginPage = (props) => {
  // console.log(props);
  
  const [showNofitifation, setShowNofitifation] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    setShowNofitifation(true);

    const timer = setTimeout(()=>{
      navigate('/login');
    },5000);
    return () => clearTimeout(timer);
  },[])
  
  return (
    <div className="">
      {
        showNofitifation && 
        <Notification
        message={props.message}
        type={'Error'}
        />
      }
    </div>
  )
}

export default NavigateToLoginPage;