import { Link } from "react-router-dom"
import styles from './Navbar.module.css'

const Navbar = ({navData}) => {
    return (
        <nav className={styles.nav}>
            <span>Company ka logo hai</span>
            <div className={styles.navRight}>
                {
                    navData && navData.map((link,idx) => {
                        return <Link idx = {idx} className={styles.navLink} to={link.link}>{link.name}</Link>
                    })
                }
            </div>
        </nav>
    )
}

export default Navbar