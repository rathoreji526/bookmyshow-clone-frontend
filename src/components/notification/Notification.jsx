import { useEffect, useState } from 'react';
import style from './Notification.module.css';

const Notification = ({ message, type }) => {
    const [isOpen, setisOpen] = useState(false);
    

    useEffect(() => {
        if (message) {
            setisOpen(true);
            const timer = setTimeout(() => {
                setisOpen(false);
            }, 5000);

            return ()  => clearTimeout(timer);
        }else{
            setisOpen(false);
        }
    },[]);
    if(!message)return null;

    return (
        <div className={`${style.notification_main} ${isOpen ? style.show : style.hide} ${type === 'Error' ? style.error : style.success}`}>
            {message} 
        </div>
    )
}

export default Notification