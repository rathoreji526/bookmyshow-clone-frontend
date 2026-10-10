import { Link } from "react-router-dom"
import styles from './Navbar.module.css'
import { useEffect, useState } from "react";

const Navbar = ({navData}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [print, setprint] = useState("");

    useEffect(()=>{
        const mobileQuery = window.matchMedia('(max-width:768px)');
        setIsMobile(mobileQuery.matches);
        const handleScreenChange = (e) => {
            setIsMobile(e.matches);
        };
        mobileQuery.addEventListener('change', handleScreenChange);
        return () => mobileQuery.removeEventListener('change', handleScreenChange);
    },[])
    
    // if(isMobile)setprint("Mobile screen found");
    // else setprint("");
    

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