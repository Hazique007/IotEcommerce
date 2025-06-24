import React, { useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from "gsap"; 

import Home from './pages/Home';
import Ioteffect from './pages/ioteffect';

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import ProductDetails from './pages/proddetails.jsx';
import AdminDashboard from './pages/Dashboard/AdminDashboard.jsx';

const App = () => {
 
  return (
    
  <BrowserRouter>
  <Routes>
     <Route path="/" Component={Ioteffect} />
      <Route path="/home" Component={Home} />
     <Route path="/product-details" Component={ProductDetails} />
      <Route path="/admin-dash" Component={AdminDashboard} />
     
  </Routes>
  
  
  </BrowserRouter>
  )
}

export default App