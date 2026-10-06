import styles from './Home.module.css'
import { NavButtonLinks } from '../../configs/NavButtons'
import Navbar from './components/navbar/Navbar'


const Home = () => {
  return (
    <div className={styles.body}>
        <div className={styles.container}>
          {/*=========== navbar===========*/}
          <Navbar navData = {NavButtonLinks}/>
          
        </div>
    </div>
  )
}

export default Home