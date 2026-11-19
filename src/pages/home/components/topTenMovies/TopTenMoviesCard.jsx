import axios from 'axios';
import styles from './TopTenMoviesCard.module.css'
import { useEffect, useState } from 'react';
import Loader from '../../../../components/loader/Loader';

const baseURL = "https://bookmyshow-backend-o592.onrender.com/";

const TopTenMoviesCard = () => {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(() => {
        const catchedData = sessionStorage.getItem('top-10-movies');
        return catchedData ? JSON.parse(catchedData) : null;
    });
    const [responseStatus, setResponseStatus] = useState();

    useEffect(() => {
        const fetchMovies = async () => {
            if (response) return;
            setLoading(true);
            try {
                const response = await axios.get(baseURL + "apis/movies/top-ten-movies");
                sessionStorage.setItem('top-10-movies', JSON.stringify(response.data));
                setResponse(response.data);
                setResponseStatus(response.status);
            } catch (error) {
                setResponse(error.response.data);
                setResponseStatus(error.status);
            } finally {
                setLoading(false);
            }
        }
        fetchMovies();
    }, [])
    return (
        <div className={styles.container}>
            {
                loading && <Loader />
            }
            <span id={styles.header}>Trending Now</span>
            <div className={`${styles.cardContainer} p-2`}>

                {
                    responseStatus >= 400 && (
                        <h2 className='text-4xl w-full text-center'>No bookings found in last 30 days.</h2>
                    )
                }
                {
                    Array.isArray(response) && response.map((data, idx) => {
                        return <div className={styles.card}>
                            <h4>⭐️ {data.rating}</h4>
                            <span className={styles.idx}>{idx}</span>
                        </div>
                    })
                }
            </div>

        </div>
    )
}

export default TopTenMoviesCard