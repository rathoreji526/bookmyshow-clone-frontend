import styles from './Home.module.css'
import { newUser, userOptions, adminOptions } from '../../configs/NavButtons'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import TopTenMoviesCard from './components/topTenMovies/TopTenMoviesCard'
import ShowCard from './components/showCard/ShowCard'
import ExploreByCity from './components/exploreByCity/ExploreByCity'
import { useEffect, useState } from 'react'
import Loader from '../../components/loader/Loader'
import axios from 'axios'

const baseURL = "https://bookmyshow-backend-o592.onrender.com";

const Home = ({ performLogout, Authenticated, userRole }) => {
  const token = localStorage.getItem('token');
  // console.log('token is: '+token);
  
  const [loading, setLoading] = useState(false);
  const [navButtons, setnavButtons] = useState([]);
  const [nowShowingResponse, setnowShowingResponse] = useState(() => {
    const data = sessionStorage.getItem('now-showing-movies');
    return data ? JSON.parse(data) : null;
  });
  const [nowShowingResponseStatus, setNowShowingResponseStatus] = useState();
  const [upcomingMovieResponse, setUpcomingMovieResponse] = useState(() => {
    const data = sessionStorage.getItem('upcoming-movies');
    return data ? JSON.parse(data) : null;
  })
  const [upcomingMoviesResponseStatus, setUpcomingMoviesResponseStatus] = useState();


  // =========== now - showing movies ==========
  useEffect(() => {
    if (nowShowingResponse != null) {
      return;
    }

    const fetchNowShowingMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          baseURL + '/apis/show/now-showing-movies'
        )
        // console.log(response.data);
        sessionStorage.setItem('now-showing-movies', JSON.stringify(response.data));
        setnowShowingResponse(response.data);
        setNowShowingResponseStatus(response.status);

      } catch (e) {
        setnowShowingResponse(e.response.data);
        setNowShowingResponseStatus(e.status);
      } finally {
        setLoading(false);
      }
    }
    fetchNowShowingMovies();

  }, [])
  useEffect(() => {
    if (upcomingMovieResponse != null) {
      return;
    }
    const fetchUpcomingMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          baseURL + "/apis/movies/upcoming-movies"
        )
        sessionStorage.setItem('upcoming-movies', JSON.stringify(response.data));
        setUpcomingMovieResponse(response.data);
        setUpcomingMoviesResponseStatus(response.status);

      } catch (e) {
        setUpcomingMovieResponse(e.response.data);
        setUpcomingMoviesResponseStatus(e.status);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcomingMovies();
  }, [])

  useEffect(() => {
    if (userRole === 'OWNER') setnavButtons(adminOptions);
    else if (userRole === 'USER') setnavButtons(userOptions);
    else setnavButtons(newUser);
  }, [userRole])


  return (
    <div className={styles.body}>
      {
        loading && <Loader />
      }
      <div className={styles.container}>

        <Navbar navData={(navButtons && (navButtons.length != 0)) ? navButtons : newUser} performLogout={performLogout} />

        <Hero />

        <TopTenMoviesCard />

        <ShowCard 
        header={"Now Showing"}
        cardData={nowShowingResponse}
        />

        <ShowCard 
        header={"Coming Soon"}
        cardData={upcomingMovieResponse}
        />

        <ExploreByCity />
      </div>
    </div>
  )
}

export default Home