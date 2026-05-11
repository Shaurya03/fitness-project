import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';  

function App() {
  return (
    <>
      <Navbar />

      <div className="pages">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
