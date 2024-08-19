import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Checkout from './pages/Checkout/Checkout';
import Perfil from './pages/Perfil/Perfil';
import Contato from './pages/Contato/Contato';
import Sobre from './pages/Sobre/Sobre';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import CreateProducts from './pages/Admin/Products/CreateProducts';
import Groups from './pages/Admin/grups/grups';
import Customer from './pages/Admin/customer/customer';
import Orders from './pages/Admin/orders/orders';

function App() {
  return (
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
          <Route path="perfil" element={<Perfil />} />
        </Route>

        {/* Rotas para a área administrativa */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="createproducts" element={<CreateProducts />} />
          <Route path="creategrups" element={<Groups />} />
          <Route path="customerlist" element={<Customer />} />
          <Route path="orders" element={<Orders />} />
          {/* Adicione mais rotas administrativas conforme necessário */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
