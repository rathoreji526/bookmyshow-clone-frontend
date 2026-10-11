import { Link } from "react-router-dom"
import styles from './Navbar.module.css'
import {Menu, MoveRight} from 'lucide-react'
import { useState } from "react"

const Navbar = ({navData}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenu = () => {
        setMenuOpen(!menuOpen);
    }
    
    return (
        <nav className={styles.nav}>
            <span>{'BRAND_LOGO [PENDING]'}</span>
            <div className={styles.navRight}>
                {
                    navData && navData.map((link,idx) => {
                        return <Link key = {idx} className={idx===navData.length-1 ? styles.redBtn : styles.navLink} to={link.link}>{link.name}</Link>
                    })
                }
                <Menu className={styles.menu} onClick={handleMenu}/>
            </div>
            <div className={`${styles.navSlidebar}  ${menuOpen ?  styles.active : styles.hide}`}>
                {
                    navData && navData.map((link,idx) => {
                        if(idx!=navData.length-1){
                            return <Link key = {idx} className={styles.menuLink} to={link.link}>{link.name}</Link>
                        }
                    })
                }
            </div>
        </nav>
    )
}

export default Navbar