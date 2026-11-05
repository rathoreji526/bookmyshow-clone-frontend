import { useEffect, useState } from 'react';
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
            setKeyCount((key) => key + 1);
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
        <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-8 relative">
            {
                loading && <Loader />
            }
            {
                receivedResponse && <Notification
                    key={Date.now()}
                    message={notificationMsg}
                    type={notificationType}
                />
            }
            <div className="w-full max-w-xl bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-6 my-auto">
                <h1
                    className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight text-center mb-2"
                >Enter Movie Details</h1>
                <div >
                    {
                        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                            {addMovieProperties && addMovieProperties.map((data, idx) => {
                                return (
                                    <div className="flex flex-col gap-2 w-full" key={idx}>
                                        <label
                                            className="text-sm font-semibold text-slate-300 tracking-wide pl-1"
                                        >{data.label}</label>
                                        <input
                                            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-sm"
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
                            <button
                                className="w-full py-3 mt-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-600/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                            >Next</button>
                        </form>

                    }

                </div>

            </div>
        </div>
    )
}

export default AddMovie