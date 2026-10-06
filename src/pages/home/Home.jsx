import styles from './Home.module.css'
import { NavButtonLinks } from '../../configs/NavButtons'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import TopTenMoviesCard from './topTenMovies/TopTenMoviesCard'


const Home = () => {
  return (
    <div className={styles.body}>
        <div className={styles.container}>
          {/* =========== navbar ============= */}
          <Navbar navData = {NavButtonLinks}/>

          {/* =========== hero ============== */}
          <Hero/>

          {/* ====== top 10 movies section ========= */}
          <TopTenMoviesCard/>

        </div>
    </div>
  )
}

export default Home