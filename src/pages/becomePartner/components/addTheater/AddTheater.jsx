import { theaterRegistration, location } from './config/AddTheaterConfig';
import style from './AddTheater.module.css';
import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Loader from './../../../../components/loader/Loader';
import { useNavigate } from 'react-router-dom';

const baseURL = 'https://bookmyshow-backend-o592.onrender.com/';

const AddTheater = () => {
  const [formValue, setFormValue] = useState([]);
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    let { name, value } = event.target;

    if (name === 'GST Number' || name === 'PAN Number' || name === 'Business License Number') {
      value = value.toUpperCase();
    }
    if (name === 'Zipcode' && value.length > 6) return;
    setFormValue((prev) => ({
      ...prev, [name]: value
    }))

  }
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const body = {
      theaterName: formValue["Theater Name"],
      gstNumber: formValue["GST Number"],
      panNumber: formValue["PAN Number"],
      businessLicenseNumber: formValue["Business License Number"],
      location: {
        country: formValue.Country,
        state: formValue.State,
        city: formValue.City,
        area: formValue.Area,
        street: formValue.Street,
        landmark: formValue.Landmark,
        zipcode: formValue.Zipcode
      }
    }
    const token = localStorage.getItem('token');
    setloading(true);
    try {
      const response = await axios.post(baseURL + 'apis/theater/register-theater',
        body,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      console.log(response?.data);

      const decoded = jwtDecode(token);
      if (decoded?.role !== 'OWNER') {
        localStorage.removeItem('token');
        window.location.reload();
      }else{
        navigate('/');
      }

    } catch (error) {
      console.log(error);

    }finally{
      setloading(false);
    }

  }
  return (
    <div className={style.main_addTheater}>
      { loading &&
        <Loader/>
      }
      <div className={style.form_container}>
        <form onSubmit={(event) => { handleFormSubmit(event) }} className={style.addTheaterForm}>
          <h1>Theater Info</h1>
          <div className={style.form_input}>
            {
              theaterRegistration && theaterRegistration.map((data, idx) => {
                return <input
                  key={idx}
                  type={data.type}
                  placeholder={data.placeholder}
                  required={data.required}
                  name={data.name}
                  maxLength={data.maxLength}
                  value={formValue[data.name] || ''}
                  onChange={handleChange}
                />
              })
            }
          </div>

          <h1>Theater location Info</h1>
          <div className={style.form_input}>
            {
              location && location.map((data, idx) => {
                return <input
                  key={idx}
                  type={data.type}
                  placeholder={data.placeholder}
                  required={data.required}
                  name={data.name}
                  maxLength={data.maxLength}
                  value={formValue[data.name] || ''}
                  onChange={handleChange}
                />
              })
            }
          </div>
          <button>Next</button>
        </form>
      </div>
    </div>
  )
}

export default AddTheater