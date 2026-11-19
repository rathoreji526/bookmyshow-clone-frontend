import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

sessionStorage.clear();
localStorage.removeItem('movies');
createRoot(document.getElementById('root')).render(
  <App/>
)
