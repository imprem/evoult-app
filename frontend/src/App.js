import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Signup from './Components/Login/Signup';
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Register from './Components/Registercase/Register';
import Casedetails from './Components/Home/Casedetails';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route
            path='/home'
            element={
              <>
                <Navbar />
                <div className='container'>
                  <Home />
                </div>
              </>
            }
          />
          <Route 
            path='/casedtails'
            element={
              <>
                <Navbar />
                <div className='container'>
                  <Register />
                </div>
              </>
            }
          />
          <Route 
            path='/casedtailsid'
            element={
              <>
                <Navbar />
                <div className='container'>
                  <Casedetails />
                  {/* <Register /> */}
                </div>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
