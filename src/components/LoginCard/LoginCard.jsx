import { useState } from 'react';
import styles from './LoginCard.module.css';
import { Link } from 'react-router-dom';

const LoginCard = ({ fields, header, bottomText, bottomLinkText, bottomLink,onSubmit,response,responseStatus }) => {
    const [formValues, setFormValue] = useState({});


    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formValues);
        // setFormValue({});
    }
    const change = (fieldName, event) =>{
        setFormValue(prev =>({
            ...prev,
            [fieldName]: event.target.value
        }))
    }
    return (
        <div className={styles.container}>
            <h1>{header}</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                {
                    Array.isArray(fields) && fields.map((field, idx) => {
                        return (<input
                            key={idx}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formValues[field.name] || ""}
                            required={field.required}
                            onChange={(event) => {
                                change(field.name, event);
                            }}
                        />)
                    })
                }
                <button>Next</button>
                <h6>
                    {bottomText}<Link to={bottomLink}>{bottomLinkText}</Link>
                </h6>
                <h6 className={Number(responseStatus) < 400 ? styles.success : styles.err}>{typeof(response)=='string' ? response : "Something went wrong!"}</h6>
            </form>
        </div>
    )
}

export default LoginCard
