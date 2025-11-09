// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Carrito from "./pages/Carrito";
import Contacto from "./pages/Contacto";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Productos from "./pages/Productos";
import Blogs from "./pages/Blogs";
import DetalleProducto from "./pages/DetalleProducto";
import Checkout from "./pages/Checkout";
import Boleta from "./pages/Boleta";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import NavbarPerfil from "./components/NavbarPerfil";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPedidos from "./pages/AdminPedidos";
import RegistroUsuarioAdmin from "./pages/RegistroUsuarioAdmin";
import PedidoEntregado from "./pages/PedidoEntregado";
import PedidoEnCamino from "./pages/PedidoEnCamino";
import AdminProductos from "./pages/AdminProductos";
import AdminEditar from "./pages/AdminEditar";
import AdminAgregar from "./pages/AdminAgregar";



function App() {

  const currentLocation = useLocation();
  
    return (
      
    <>
    {(currentLocation.pathname === "/perfil" || currentLocation.pathname === "/editar-perfil") 
     ?<NavbarPerfil /> 
     :<Navbar />}


    {(currentLocation.pathname.startsWith("/perfil") ||
      currentLocation.pathname.startsWith("/admin")) ? (
      <></>
    ) : (
      <Navbar />
    )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/producto/:slug" element={<DetalleProducto />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/boleta" element={<Boleta />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/pedido-entregado" element={<PedidoEntregado />} />
        <Route path="/pedido-en-camino" element={<PedidoEnCamino />} />



        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin/registro-usuario" element={<RegistroUsuarioAdmin />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/editar/" element={<AdminEditar />} />
        <Route path="/admin/crear" element={<AdminAgregar />} />



        
        


      </Routes>
      <Footer />
    </>
  );
}

export default App;
