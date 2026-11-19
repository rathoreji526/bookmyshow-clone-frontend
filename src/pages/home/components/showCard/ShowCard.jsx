import { useNavigate } from 'react-router-dom';
import style from './ShowCard.module.css';

const ShowCard = ({ header, cardData }) => {
    const navigate = useNavigate();
    return (
        <div className={style.nowStreaming}>
            <span>{header}</span>
            <div className={style.container}>
                {
                    Array.isArray(cardData) && cardData.map((data, idx) => {
                        return <div
                            className={`${style.dabba} transition duration-150 hover:scale-102 active:scale-100`}
                            key={idx}
                            onClick={() => {
                                if (header === 'Now Showing') {
                                    navigate('/movie/shows',{
                                        state:{
                                            movieId:data.id
                                        }
                                    })
                                }
                            }}
                        >
                            <div className={`${style.imgSection} bg-[url('${data.posterUrl}')]`}></div>
                            <div className={style.textSection}>
                                <h3>{data.name}</h3>
                                <h4>{data.description === null ? 'Description not provided' : data.description}</h4>
                            </div>
                        </div>
                    })
                }


            </div>
        </div>
    )
}

export default ShowCard