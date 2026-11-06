import { useNavigate, useLocation } from "react-router-dom"
import { addScreen } from "../../config/AddScreenConfig";
import { useEffect, useState } from "react";

const baseURL = 'https://bookmyshow-backend-o592.onrender.com/'

const AddScreen = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem("addScreenFormData");
    return savedData ? JSON.parse(savedData) : {};
  })
  const location = useLocation();
  const theaterId = location.state?.theaterId;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      'theaterId': theaterId
    }))
  },[])


  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("addScreenFormData", JSON.stringify(formData));
    navigate('/preview-screen', {
      state: {
        theaterId: theaterId
      }
    });
  }


  return (
    <div className="min-h-full w-full bg-slate-900 text-slate-100 flex p-8 flex-col items-center justify-between">
      <h1 className="text-3xl font-extrabold text-amber-400 tracking-tight mb-8">{addScreen.title}</h1>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        id="addScreenForm"
        className="w-full max-w-4xl bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-slate-700/60 shadow-xl grid grid-cols-1 sm:grid-cols-2 gap-6">

        {
          addScreen && addScreen.fields.map((data, idx) => {
            return (
              <div
                className="flex flex-col gap-2"
                key={idx}>
                <label
                  for={data.name}
                  className="text-sm font-semibold text-slate-300 tracking-wide pl-1"
                >{data.label}</label>
                <input
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-sm"
                  placeholder={data.placeholder}
                  name={data.name}
                  type={data.type}
                  required={data.required}
                  value={formData[data.name] || ''}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </div>
            )
          })
        }



      </form>
      <div className="w-full max-w-4xl flex justify-end mt-8 px-2">
        <button
          type="submit"
          form="addScreenForm"
          className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >Next</button>
      </div>
    </div>
  )
}

export default AddScreen


/**
**REQUIREMENTS**
=> Jaise he admin kisi manageTheater/theater par click kare  system theater Id ko note down kar le aur jaha jarurat ho waha forward kar de! like we need theaterId in Add screen so we have to pass it! 

=> Implement form handling
=> inputs:- Screen name, total rows, seats per row(column),  list of seatLayout

=> seat type
    SILVER,
    GOLD,
    PREMIUM


create screen dto layout

    private UUID theaterId;
    private String screenName;
    private int totalRows;
    private int seatsPerRow;
    private List<SeatLayoutDTO> layout;


    SeatLayoutDTO
    private String rowName;
    private int startSeat;
    private int endSeat;
    private SeatType seatType;

 */