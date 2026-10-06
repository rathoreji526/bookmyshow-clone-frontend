import { Link } from "react-router-dom"
import styles from './Navbar.module.css'

const Navbar = ({navData}) => {
    return (
        <nav className={styles.nav}>
            <span>{'BRAND_LOGO [PENDING]'}</span>
            <div className={styles.navRight}>
                {
                    navData && navData.map((link,idx) => {
                        return <Link key = {idx} className={idx===navData.length-1 ? styles.redBtn : styles.navLink} to={link.link}>{link.name}</Link>
                    })
                }
            </div>
        </nav>
    )
}

export default Navbar