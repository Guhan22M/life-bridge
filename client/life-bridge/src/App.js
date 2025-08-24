import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import FirstAid from './pages/FirstAid';
import BloodReq from './pages/BloodReq';
import AuthPage from './pages/AuthPage';
import History from './components/History';
import GoogleSuccess from './pages/GoogleSuccessPage';
// import AmbulancePrompt from './components/AmbulancePrompt';
function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<AuthPage/>}/>
        <Route path='/google-success' element={<GoogleSuccess/>} />
        {/* <Route path='/' element={<AmbulancePrompt/>}/> */}
        <Route element={<ProtectedRoute/>}>
          <Route path='/home' element={<Home/>} />
          <Route path='/first-aid' element={<FirstAid/>} />
          <Route path='/blood-req' element={<BloodReq/>} />
          <Route path='/history' element={<History/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
