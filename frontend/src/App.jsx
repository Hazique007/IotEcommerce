import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Home from './pages/Home';
import Ioteffect from './pages/ioteffect';
import AllProducts from './pages/allproducts.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Aboutpage from './pages/Aboutpage.jsx';
import ordersummary from './pages/ordersummary.jsx';
import OrderSuccess from './pages/ordersuccessfullpage.jsx';
import ProtectedAdminRoute from './components/protectadminroute.jsx';
import ProductDetails from './pages/proddetails.jsx';
import AdminDashboard from './pages/Dashboard/AdminDashboard.jsx';
import CartPage from './pages/CartPage.jsx';
import Unauthorized from './pages/unauthoried.jsx';
import profile from './pages/profile.jsx';
import AddUseCase from './pages/useCaseForm.jsx';
import LocationTracker from './pages/CustomPages/locationtracker.jsx';
import InventoryDashboard from './pages/inventoryManagement/inventroyDashbaord.jsx';
import UserOrderHistory from './pages/userOrderspage.jsx';
import OrdersDashboard from './pages/orderDashboard/DashboardOrders.jsx';

const App = () => {
  return (
    <BrowserRouter>
    <LocationTracker />
     

      <Routes>
        <Route path="/" Component={Ioteffect} />
        <Route path="/home" Component={Home} />
        <Route path="/product-details/:id" Component={ProductDetails} />
        <Route path="/inventory-dash" Component={InventoryDashboard} />
        <Route path="/add-usecase" Component={AddUseCase} />
        <Route path="/user-orders" Component={UserOrderHistory} />
        <Route path="/orders-dash" Component={OrdersDashboard} />
        <Route path="/unauthorized" Component={Unauthorized} />
        <Route
          path="/admin-dash"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/allprodcuts" Component={AllProducts} />
        <Route path="/cart" Component={CartPage} />
        <Route path="/login" Component={AuthPage} />
        <Route path="/about" Component={Aboutpage} />
        <Route path="/order-summary" Component={ordersummary} />
        <Route path="/order-success" Component={OrderSuccess} />
        <Route path="/profile" Component={profile} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
