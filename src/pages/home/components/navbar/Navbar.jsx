import { useNavigate } from "react-router-dom"
import styles from './Navbar.module.css'
import { Menu } from 'lucide-react'
import { useState } from "react"

const Navbar = ({ navData }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenu = () => {
        setMenuOpen(!menuOpen);
    }
    const performlogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }
    const handleButtonClick = (item) => {
        if(item.name==='Logout'){
            performlogout();
            console.log("Logging out");
            
        }else if(item.link){
            navigate(item.link);
        }else{
            console.log('no root detected!'); 
        }
    }

    return (
        <nav className={styles.nav}>
            <span>{'BRAND_LOGO [PENDING]'}</span>
            <div className={styles.navRight}>
                {
                    navData && navData.map((item, idx) => {
                        return <button
                        key={idx} 
                        className={idx === navData.length - 1 ? styles.redBtn : styles.navLink} 
                        onClick={() => {handleButtonClick(item)}}
                        >{item.name}</button>
                    })
                }
                <Menu className={navData.length != 1 ? styles.menu : styles.hideMenu} onClick={()=>{handleMenu()}} />
            </div>
            <div className={`${styles.navSlidebar}  ${menuOpen && navData.length != 1 ? styles.active : styles.hide}`}>
                {
                    navData && navData.map((item, idx) => {
                        if (idx != navData.length - 1) {
                            return <button 
                            key={idx} 
                            className={styles.menuLink} 
                            onClick={() => {handleButtonClick(item)}}
                            >{item.name}</button>
                        }
                    })
                }
            </div>
        </nav>
    )
}

export default Navbar