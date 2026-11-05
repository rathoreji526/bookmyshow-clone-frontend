import { useNavigate } from "react-router-dom"
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

  const handleTheaterClick = (theaterId) => {
    navigate('/manage-menu',{
      state:{
        theaterId:theaterId
      }
    });
  }

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
        // console.log(response.data.location);

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
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center justify-between p-8 relative">
      {
        loading && <Loader/>
      }
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-auto p-20">
        {
          theaters && theaters.map((data, idx) => {
            return <div
              key={idx}
              className="bg-slate-800/60 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl shadow-xl hover:border-amber-500/50 hover:shadow-amber-500/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col gap-2"
              onClick={()=>{
                handleTheaterClick(data.id);
              }}
            >
              <h4
              className="text-lg font-bold text-amber-400 tracking-wide"
              >{data.name}</h4>
              <h6
              className="text-xs font-medium text-slate-400 tracking-wider uppercase"
              >{data.panNumber}</h6>
            </div>
          })
        }
      </div>
      <button 
      className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer mt-6"
      onClick={addMovie}>Add Movie</button>
    </div>
  )
}

export default ManageTheater
/**
 Notification of adding movie!
 Show all theaters when user will come to this page! ✅

*/