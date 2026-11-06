import { useLocation, useNavigate } from "react-router-dom"
import { createShow } from "../../config/CreateShowConfig";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Loader from "../../../../components/loader/Loader";
import Notification from "../../../../components/notification/Notification";
import axios from "axios";

const baseURL = "https://bookmyshow-backend-o592.onrender.com";

const CreateShow = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp < currentTime) {
                localStorage.removeItem('token');
                navigate('/');
            }

        } catch (error) {
            console.error("Invalid token:", error);
            navigate('/');
        }
    }, [navigate]);
    const theaterId = location.state?.theaterId;
    const screenId = location.state?.screenId;
    const movieId = location.state?.movieId;
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState();
    const [responseStatus, setResponseStatus] = useState();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // console.log(formData);

    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // console.log("🚀 Form submit function chal gaya!");
        const body = {
            'theaterId': theaterId,
            'movieId': movieId,
            'screenId': screenId,
            'startTime': formData.startTime,
            'endTime': formData.endTime,
            'language': formData.language,
            'format': formData.format,
            'price_silver': formData.price_silver,
            'price_gold': formData.price_gold,
            'price_premium': formData.price_premium

        }
        // console.log(body);
        // console.log(token);


        setLoading(true);
        try {
            const response = await axios.post(
                baseURL + '/apis/show/create-show',
                body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
            setResponse(response.data)
            setResponseStatus(response.status);
            // console.log(response);

        } catch (e) {
            // console.log(e);
            setResponse(e.response.data);
            setResponseStatus(e.status);

        } finally {
            setLoading(false);
        }
        // console.log(formData);
    }
    return (
        <div
            className="min-h-full flex items-center justify-center bg-slate-900 text-white gap-10">
            {
                loading && <Loader />
            }
            {
                !loading && response && <Notification
                    key={Date.now()}
                    message={response}
                    type={responseStatus < 400 ? 'Success' : 'Error'}
                />
            }
            <div className="flex flex-col gap-4">
                <label
                    className="text-3xl"
                >{createShow.formTitle}</label>
                <form
                    onSubmit={(e) => {
                        handleFormSubmit(e);
                    }}
                >
                    {
                        createShow && createShow.fields.map((data, idx) => {
                            return <div
                                key={idx}
                                className="flex flex-col gap-2 p-2 sm:w-md md:w-lg"
                            >
                                <label
                                    className="text-sm font-medium text-slate-300 tracking-wide"
                                >{data.label}</label>
                                {
                                    data.type === 'dropdown' ? (
                                        <select
                                            name={data.name}
                                            type={data.type}
                                            required={data.required}
                                            className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer shadow-sm"
                                            onChange={handleChange}

                                        >
                                            {
                                                data.options && data.options.map((data, idx) => {
                                                    return <option
                                                        className="bg-slate-900 text-white py-2"
                                                        key={idx}
                                                        value={data}
                                                    >
                                                        {data}
                                                    </option>
                                                })
                                            }
                                        </select>
                                    ) : (
                                        <input
                                            className="w-full bg-slate-800/80 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-sm placeholder:text-slate-500"
                                            type={data.type}
                                            placeholder={data.placeholder}
                                            name={data.name}
                                            required={data.required}
                                            value={formData[data.name] || ''}
                                            onChange={handleChange}
                                        />
                                    )
                                }
                            </div>
                        })
                    }
                    <button
                        className="w-full border rounded p-2 bg-amber-950 mt-4">Create Show</button>
                </form>
            </div>
        </div>
    )
}

export default CreateShow