import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
/*import ProtectedRouteAdmin from './components/ProtectedRoute/ProtectedRouteAdmin ';*/ //caso seja protegido por token, descomentar essa linha
import ProtectedRouteCliente from './components/ProtectedRoute/ProtectedRouteCliente ';
import Home from './pages/Home/Home';
import Products from './pages/Client/Products/Products';
import ProductDetails from './pages/Client/ProductDetails/ProductDetails';
import Checkout from './pages/Client/Checkout/Checkout';
import Perfil from './pages/Client/Perfil/Perfil';
import Contato from './pages/Client/Contato/Contato';
import Sobre from './pages/Client/Sobre/Sobre';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import Promotion from './pages/Admin/Promotion/Promotion';
import DeliveryConfig from './pages/Admin/DeliveryConfig/DeliveryConfig';
import CouponsPage from './pages/Admin/CouponsPage/CouponsPage';
import ProductsPage from './pages/Admin/Products/ProductsPage';
import CarouselImagesPage from './pages/Admin/Carousel/CarouselPage';
import Groups from './pages/Admin/Grups/Grups';
import Customer from './pages/Admin/Customer/Customer';
import Orders from './pages/Admin/Orders/Orders';
import AdminLoginForm from './components/LoginAdmin/AdminLoginForm';
import ClienteLoginForm from './components/LoginCliente/ClienteLoginForm';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}>
    <Router>
      <Routes>
        {/* Rotas para o site principal (clientes) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="about" element={<Sobre />} />
          <Route path="contact" element={<Contato />} />
          <Route path="perfil" element={<ProtectedRouteCliente component={Perfil} />} />
        </Route>

        {/* Rotas de login */}
        <Route path="/loginadmin" element={<AdminLoginForm />} />
        <Route path="/login" element={<ClienteLoginForm />} />

        {/* Rotas para a área administrativa */}
        <Route path="/admin/*" element={<AdminLayout />}> {/* Alterar por essa informação protege os menus com token: <Route path="/admin/*" element={<ProtectedRouteAdmin allowedRoles={['administrador']} component={AdminLayout} />}>*/ }
        {/*<Route path="/admin/*" element={<AdminLayout />}>  Alterar por essa informação protege os menus com token: <Route path="/admin/*" element={<ProtectedRouteAdmin allowedRoles={['administrador']} component={AdminLayout} />}>*/ }
          <Route index element={<AdminDashboard />} />
          <Route path="createproducts" element={<ProductsPage />} />
          <Route path="creategrups" element={<Groups />} />
          <Route path="createpromotion" element={<Promotion />} />
          <Route path="DeliveryConfig" element={<DeliveryConfig />} />ss
          <Route path="createcupons" element={<CouponsPage />} />
          <Route path="editcarousel" element={<CarouselImagesPage />} />
          <Route path="customerlist" element={<Customer />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
