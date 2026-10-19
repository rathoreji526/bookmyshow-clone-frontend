import { useEffect, useState } from 'react';
import style from './AddMovie.module.css';
import { addMovieProperties } from './config/AddMovieConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/loader/Loader';
import Notification from '../../../../components/notification/Notification';

const baseURL = 'https://bookmyshow-backend-o592.onrender.com/';

const AddMovie = () => {
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [receivedResponse, setreceivedResponse] = useState(true);
    const [notificationMsg, setNotificationMsg] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [keyCount, setKeyCount] = useState(0);

    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(formData);
        const body = {
            'name': formData.name,
            'duration': formData.duration,
            'language': formData.language,
            'releaseDate': formData.releaseDate,
            'rating': formData.rating
        }

        setLoading(true);
        try {
            const response = await axios.post(
                baseURL + 'apis/movies/add-movie',
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setNotificationMsg(response.data);
            setNotificationType("Success");

        } catch (error) {
            setNotificationMsg(error.message);
            setNotificationType("Error");
        } finally {
            setLoading(false);
            setreceivedResponse(true);
            setKeyCount((key)=>key+1);
        }
    }
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    return (
        <div className={style.addMovie_main}>
            {
                loading && <Loader />
            }
            {
                receivedResponse && <Notification
                key={keyCount}
                message={notificationMsg}
                type={notificationType}
                />
            }
            <div className={style.mainContainer}>
                <h1>Enter Movie Details</h1>
                <div >
                    {
                        <form className={style.inputContainer} onSubmit={handleSubmit}>
                            {addMovieProperties && addMovieProperties.map((data, idx) => {
                                return (
                                    <div className={style.input} key={idx}>
                                        <label>{data.label}</label>
                                        <input
                                            name={data.name}
                                            placeholder={data.placeholder}
                                            type={data.type}
                                            required={data.required}
                                            step={data.step}
                                            min={data.min}
                                            max={data.max}
                                            value={formData[data.name]}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )
                            })}
                            <button>Next</button>
                        </form>

                    }

                </div>

            </div>
        </div>
    )
}

export default AddMovie