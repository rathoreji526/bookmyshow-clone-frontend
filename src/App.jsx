import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Home from './pages/home/Home'
import "./App.css"

const App = () => {
  return (
    <Router>
      <div className="body">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
