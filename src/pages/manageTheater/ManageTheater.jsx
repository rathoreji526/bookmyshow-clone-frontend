import { useNavigate } from "react-router-dom"
import style from './ManageTheater.module.css'

const ManageTheater = () => {
  const navigate = useNavigate();

  const addMovie = () => {
    navigate('/manage-theater/add-movie');
  }

  return (
    <div className={style.manageTheater_main}>
      <button>Theater 1</button>
      <button>Theater 2</button>
      <button onClick={addMovie}>Add Movie</button>
    </div>
  )
}

export default ManageTheater