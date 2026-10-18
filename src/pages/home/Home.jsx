import styles from './Home.module.css'
import { newUser, userOptions, adminOptions } from '../../configs/NavButtons'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import TopTenMoviesCard from './components/topTenMovies/TopTenMoviesCard'
import ShowCard from './components/showCard/ShowCard'
import ExploreByCity from './components/exploreByCity/ExploreByCity'
import { useEffect, useState } from 'react'
import Loader from '../../components/loader/Loader'


const Home = ({ performLogout, Authenticated, userRole, loading }) => {
  const [navButtons, setnavButtons] = useState([]);
  
  useEffect(() => {
    if (userRole === 'OWNER') setnavButtons(adminOptions);
    else if (userRole === 'USER') setnavButtons(userOptions);
    else setnavButtons(newUser);
  }, [userRole])


  if(loading){
    return (<Loader/>)
  }
  return (
    <div className={styles.body}>
      <div className={styles.container}>

        <Navbar navData={(navButtons && (navButtons.length != 0)) ? navButtons : newUser} performLogout={performLogout} />

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