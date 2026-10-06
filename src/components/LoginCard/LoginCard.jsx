import styles from './LoginCard.module.css';
import { Link } from 'react-router-dom';

const handleSubmit = (e) => {
    e.preventDefault();
}

const LoginCard = ({fields,header,bottomText,bottomLinkText,bottomLink}) => {
  return (
    <div className={styles.container}>
                <h1>{header}</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {
                        Array.isArray(fields) && fields.map((field,idx) => {
                           return (<input 
                            idx={idx}
                            type={field.type} 
                            placeholder={field.placeholder}
                            />)
                        } )
                    }
                    <button>Next</button>
                    <h6>
                        {bottomText}<Link to={bottomLink}>{bottomLinkText}</Link>
                    </h6>
                </form>
            </div>
  )
}

export default LoginCard
