import styles from './TopTenMoviesCard.module.css'

const TopTenMoviesCard = () => {
    return (
        <div className={styles.container}>
            <span id = {styles.header}>Trending Now</span>
            <div className={styles.cardContainer}>
                <div className={styles.card}>
                    <h4>⭐️ {8.5}</h4>
                    <span className= {styles.idx}>{1}</span>
                </div>
                <div className={styles.card}>
                    <h4>⭐️ {8.2}</h4>
                    <span className= {styles.idx}>2</span>
                </div>
                <div className={styles.card}>
                    <h4>⭐️ {8.6}</h4>
                    <span className= {styles.idx}>3</span>
                </div>
                <div className={styles.card}>
                    <h4>⭐️ {7.5}</h4>
                    <span className= {styles.idx}>4</span>

                </div>
                <div className={styles.card}>
                    <h4>⭐️ {7.9}</h4>
                    <span className= {styles.idx}>5</span>
                </div>
                <div className={styles.card}>
                    <h4>⭐️ {8.1}</h4>
                    <span className= {styles.idx}>6</span>
                </div>
                <div className={styles.card}>
                    <h4>⭐️ {8.9}</h4>
                    <span className= {styles.idx}>7</span>
                </div>
                <div className={styles.card}>
                    <h4>⭐️ {8.0}</h4>
                    <span className= {styles.idx}>8</span>
                </div>
                <div className={styles.card}>
                    <h4>⭐️ {8.2}</h4>
                    <span className= {styles.idx}>9</span>
                </div>
                <div className={styles.card}>
                    <h4>⭐️ {8.8}</h4>
                    <span className= {styles.idx}>10</span>
                </div>
            </div>

        </div>
    )
}

export default TopTenMoviesCard