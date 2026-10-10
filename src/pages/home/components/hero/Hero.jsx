import styles from './Hero.module.css'

const Hero = () => {
    return (
        <div className={styles.hero}>
            <div className={styles.heroText}>
                <h1>Your next movie night starts here.</h1>
                <h3> 🍿 Discover movies, shows & book your seats.</h3>
            </div>
            <div className={styles.heroSearch}>
                <input type="text" placeholder='Search movies, events, concerts...' />
                <button>Search</button>
            </div>
        </div>
    )
}

export default Hero