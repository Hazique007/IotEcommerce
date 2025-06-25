import React, { useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from "gsap";

import Home from './pages/Home';
import Ioteffect from './pages/ioteffect';
import AllProducts from './pages/allproducts.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Aboutpage from './pages/Aboutpage.jsx';
import ordersummary from './pages/ordersummary.jsx';
import OrderSuccess from './pages/ordersuccessfullpage.jsx';
import ProtectedAdminRoute from './components/protectadminroute.jsx';

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import ProductDetails from './pages/proddetails.jsx';
import AdminDashboard from './pages/Dashboard/AdminDashboard.jsx';
import CartPage from './pages/CartPage.jsx';
import Unauthorized from './pages/unauthoried.jsx';


const App = () => {

  return (
   
    <BrowserRouter>
     
      <Routes>
        <Route path="/" Component={Ioteffect} />
        <Route path="/home" Component={Home} />
        <Route path="/product-details/:id" Component={ProductDetails} />
        <Route path="/unauthorized" Component={Unauthorized} />
       <Route path="/admin-dash" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/allprodcuts" Component={AllProducts} />
        <Route path="/cart" Component={CartPage} />
        <Route path="/login" Component={AuthPage} />
        <Route path="/about" Component={Aboutpage} />
        <Route path="/order-summary" Component={ordersummary} />
        <Route path="/order-success" Component={OrderSuccess} />

      </Routes>

      
    </BrowserRouter>
   
  )
}

export default App