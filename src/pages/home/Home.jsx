import styles from './Home.module.css'
import { NavButtonLinks } from '../../configs/NavButtons'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import TopTenMoviesCard from './components/topTenMovies/TopTenMoviesCard'
import ShowCard from './components/showCard/ShowCard'

const Home = () => {
  return (
    <div className={styles.body}>
        <div className={styles.container}>
          
          <Navbar navData = {NavButtonLinks}/>

          <Hero/>

          <TopTenMoviesCard/>

          <ShowCard header={"Now Showing"}/>

          <ShowCard header={"Coming Soon"}/>

        </div>
    </div>
  )
}

export default Home