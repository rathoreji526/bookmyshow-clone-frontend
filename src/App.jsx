import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import Bookings from './pages/bookings/Bookings'
import BecomePartner from './pages/becomePartner/BecomePartner'
import ManageTheater from './pages/manageTheater/ManageTheater'
import "./App.css"

const App = () => {
  return (
    <Router>
      <div className="body">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path='/bookings'element={<Bookings/>}/>
          <Route path='/become-partner'element={<BecomePartner/>}/>
          <Route path='/manage-theater' element={<ManageTheater/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
