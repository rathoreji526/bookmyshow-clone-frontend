import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import Bookings from './pages/bookings/Bookings'
import BecomePartner from './pages/becomePartner/BecomePartner'
import ManageTheater from './pages/manageTheater/ManageTheater'
import "./App.css"
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import AddMovie from './pages/manageTheater/components/addMovie/AddMovie'


const App = () => {
  const [Authenticated, setAuthenticated] = useState(false);
  const [Role, setRole] = useState('');
  const [loading, setLoading] = useState(true)


  const handleLoginSuccess = (token) =>{
    try{
      const decoded = jwtDecode(token);
      setAuthenticated(true);
      setRole(decoded.role);
    }catch(error){
      console.log(error);
    }
  }

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('token');
    window.location.reload();
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const manageUserLogin = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const expiryTime = decoded.exp;
          const currentTime = Date.now() / 1000;
          if (currentTime > expiryTime) {
            handleLogout();
          } else {
            setAuthenticated(true);
            setRole(decoded.role);
          }
        } catch (e) {
          console.log(e);
          handleLogout();
        }
      } else {
        console.log("token not found!");
      }
    }
    manageUserLogin();
    setLoading(false);
  }, [])

  return (
    <Router>
      <div className="body">
        <Routes>
          <Route path="/login" element={<Login
          onSuccessfulLogin={handleLoginSuccess}
           />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home
            performLogout={handleLogout}
            Authenticated={Authenticated}
            userRole={Role}
            loading={loading}
            />}
            
          />
          <Route path='/bookings' element={<Bookings />} />
          <Route path='/become-partner' element={<BecomePartner />} />
          <Route path='/manage-theater' element={<ManageTheater />} />
          <Route path='/manage-theater/add-movie' element={<AddMovie/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
