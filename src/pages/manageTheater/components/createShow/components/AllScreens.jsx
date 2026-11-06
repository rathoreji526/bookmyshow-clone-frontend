import axios from "axios";
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../../../components/loader/Loader";
import Notification from "../../../../../components/notification/Notification";

const baseURL = "https://bookmyshow-backend-o592.onrender.com";

const AllScreens = () => {
    const navigate = useNavigate();
    const [response, setresponse] = useState();
    const [responseStatus, setResponseStatus] = useState();
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const theaterId = location.state?.theaterId;
    const token = localStorage.getItem('token');

    const [screens, setScreens] = useState(() => {
        const data = sessionStorage.getItem(`all-screens ${theaterId}`);
        return data ? JSON.parse(data) : null;
    })
    useEffect(() => {
        const fetchScreens = async () => {

            if (screens !== null) {
                return;
            }
            setLoading(true);
            try {
                const response = await axios.get(
                    baseURL + '/apis/screen/findBytheaterId',
                    {
                        params: {
                            theaterID: theaterId
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const screens = response.data;
                sessionStorage.setItem(`all-screens ${theaterId}`, JSON.stringify(screens));
                setScreens(screens);
                setresponse(response.data);
                setResponseStatus(response.status);
            } catch (e) {
                setresponse(e.response.data);
                setResponseStatus(e.status);
            } finally {
                setLoading(false);
            }
        }
        fetchScreens();
    }, [])

    return (
        <div className="h-full w-full flex justify-center items-center bg-slate-900">
            {
                loading && <Loader />
            }
            {
                responseStatus >= 400 && <Notification
                    key={Date.now()}
                    message={response}
                    type={'Error'}
                />
            }
            <div className="flex flex-col gap-4 w-full max-w-md bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-sm">
                {
                    screens && screens.map((data, idx) => {
                        return <div
                            className="group relative flex items-center justify-between p-4 duration-300 ease-in-out bg-gradient-to-r from-amber-600 to-amber-700 hover:scale-[1.02] hover:from-amber-500 hover:to-amber-600 shadow-lg hover:shadow-amber-600/30 text-white font-semibold rounded-xl border border-amber-500/30 cursor-pointer overflow-hidden"
                            key={idx}
                            onClick={() => {
                                navigate('/all-movies', {
                                    state: {
                                        theaterId: theaterId,
                                        screenId: data.id
                                    }
                                })
                            }}
                        >
                            {data.name}
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default AllScreens
