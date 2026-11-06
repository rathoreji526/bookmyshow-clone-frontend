import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../../../../components/loader/Loader";
import Notification from "../../../../../components/notification/Notification";
import { useLocation, useNavigate } from "react-router-dom";

const baseURL = "https://bookmyshow-backend-o592.onrender.com";

const AllMovies = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState();
    const [responseStatus, setResponseStatus] = useState();
    const [movies, setMovies] = useState(() => {
        const data = localStorage.getItem('movies');
        return data ? JSON.parse(data) : null;
    });
    const location = useLocation();
    const theaterId = location.state?.theaterId;
    const screenId = location.state?.screenId;
    const navigate = useNavigate();
    useEffect(() => {
        const fetchMovies = async () => {

            if (movies != null) {
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(
                    baseURL + '/apis/movies/getAllMovies'
                )
                localStorage.setItem('movies', JSON.stringify(response.data));
                setResponse(response.data);
                setResponseStatus(response.status);
            }catch(e){
                setResponse(e.response.data);
                setResponseStatus(e.status);
            }finally{
                setLoading(false);
            }

        }
        fetchMovies();
    }, [])
    
    return (
        <div className="bg-slate-900 min-h-full w-full text-white flex justify-start items-center flex-col p-4 sm:p-8 md:p-12 gap-8 sm:gap-12">
            <h1
            className="text-3xl sm:text-4xl md:text-5xl align-top p-5"
            >Select Movie</h1>
            {
                loading && <Loader/>
            }
            {
                responseStatus >= 400 && <Notification
                key={Date.now()}
                message={response}
                type={'Error'}
                />
            }
            <div className="w-full max-w-7xl grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 sm:gap-6 p-6 sm:p-8">
                {
                    movies && movies.map((data, idx)=>{
                        return <div
                        key={idx}
                        className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl shadow-xl hover:border-amber-500/50 hover:shadow-amber-500/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col gap-2 active:scale-95"
                        onClick={()=>{
                            navigate('/create-show',{
                                state:{
                                    theaterId:theaterId,
                                    screenId:screenId,
                                    movieId: data.id
                                }
                            })
                        }}
                        >
                            <h4 className="text-lg font-bold text-amber-400 tracking-wide">{data.name}</h4>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default AllMovies