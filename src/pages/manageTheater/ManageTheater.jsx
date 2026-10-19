import { useNavigate } from "react-router-dom"
import style from './ManageTheater.module.css'
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";

const baseURL = "https://bookmyshow-backend-o592.onrender.com/";

const ManageTheater = () => {
  const navigate = useNavigate();
  const [theaters, setTheaters] = useState([]);
  const [loading, setloading] = useState(false)

  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() * 1000;
      const tokenExpiry = decoded.exp;

      if (currentTime < tokenExpiry) {
        navigate("/");
      }
    }
    catch (error) {
      navigate("/");
    }
  } else {
    navigate("/");
  }

  useEffect(() => {
    const fetchAllTheaters = async () => {
      setloading(true)
      try {
        const response = await axios.get(baseURL + "apis/theater/getAllTheaterByAdmin",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        console.log(response.data.location);

        setTheaters(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    }

    fetchAllTheaters();
  }, [])


  const addMovie = () => {
    navigate('/manage-theater/add-movie');
  }

  return (
    <div className={style.manageTheater_main}>
      {
        loading && <Loader/>
      }
      <div className={style.theaterContainer}>
        {
          theaters && theaters.map((data, idx) => {
            return <div
              key={idx}
              className={style.theater}
            >
              <h4>{data.name}</h4>
              <h6>{data.panNumber}</h6>
            </div>
          })
        }
      </div>
      <button onClick={addMovie}>Add Movie</button>
    </div>
  )
}

export default ManageTheater
/**
 Notification of adding movie!
 Show all theaters when user will come to this page! ✅

*/