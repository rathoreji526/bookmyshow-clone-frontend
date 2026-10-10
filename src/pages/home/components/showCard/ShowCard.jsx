import style from './ShowCard.module.css';

const ShowCard = ({header}) => {
  return (
    <div className={style.nowStreaming}>
        <span>{header}</span>
        <div className={style.container}>
            <div className={style.dabba}>
                <div className={style.imgSection}></div>
                <div className={style.textSection}>
                    <h3>Lorem ipsum dolor sit amet.lor sit amet.</h3>
                    <h4>Action/adventure Lorem ipsum dolor sit amet.</h4>
                </div>
            </div>
            <div className={style.dabba}>
                <div className={style.imgSection}></div>
                <div className={style.textSection}>
                    <h3>Lorem ipsum dolor sit amet.lor sit amet.</h3>
                    <h4>Action/adventure Lorem ipsum dolor sit amet.</h4>
                </div>
            </div>
            <div className={style.dabba}>
                <div className={style.imgSection}></div>
                <div className={style.textSection}>
                    <h3>Lorem ipsum dolor sit amet.lor sit amet.</h3>
                    <h4>Action/adventure Lorem ipsum dolor sit amet.</h4>
                </div>
            </div>
            <div className={style.dabba}>
                <div className={style.imgSection}></div>
                <div className={style.textSection}>
                    <h3>Lorem ipsum dolor sit amet.lor sit amet.</h3>
                    <h4>Action/adventure Lorem ipsum dolor sit amet.</h4>
                </div>
            </div>
            <div className={style.dabba}>
                <div className={style.imgSection}></div>
                <div className={style.textSection}>
                    <h3>Lorem ipsum dolor sit amet.lor sit amet.</h3>
                    <h4>Action/adventure Lorem ipsum dolor sit amet.</h4>
                </div>
            </div>
            <div className={style.dabba}>
                <div className={style.imgSection}></div>
                <div className={style.textSection}>
                    <h3>Lorem ipsum dolor sit amet.lor sit amet.</h3>
                    <h4>Action/adventure Lorem ipsum dolor sit amet.</h4>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowCard