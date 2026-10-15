import styles from './Home.module.css'
import { newUser, userOptions, adminOptions } from '../../configs/NavButtons'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import TopTenMoviesCard from './components/topTenMovies/TopTenMoviesCard'
import ShowCard from './components/showCard/ShowCard'
import ExploreByCity from './components/exploreByCity/ExploreByCity'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'

const Home = () => {
  const [navButtons, setNavButtons] = useState([]);

  useEffect(() => {
    const getUserRole = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);

          if (decoded?.role == 'USER') {
            setNavButtons(userOptions);
            
          } else if (decoded?.role == 'ADMIN') {
            setNavButtons(adminOptions);
          }
        } catch (error) {
          console.log("invalid token");
        }
      } else {
        setNavButtons(newUser);
      }
    }
    getUserRole();
  }, [])
  return (
    <div className={styles.body}>
      <div className={styles.container}>

        <Navbar navData={(navButtons && (navButtons.length != 0)) ? navButtons : newUser} />

        <Hero />

        <TopTenMoviesCard />

        <ShowCard header={"Now Showing"} />

        <ShowCard header={"Coming Soon"} />

        <ExploreByCity />
      </div>
    </div>
  )
}

export default Home