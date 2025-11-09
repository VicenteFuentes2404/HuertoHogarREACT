import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/img/logo-huerto.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminSidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `nav-link ${location.pathname === path ? "fw-bold text-success" : "text-dark"}`;

  return (
    <div
      className="d-flex flex-column p-3 bg-light min-vh-100 menu"
      style={{ width: "280px", borderRight: "1px solid gray" }}
    >
      <Link
        to="/"
        className="d-flex align-items-center justify-content-center mb-3 mb-md-0 link-dark text-decoration-none"
      >
        <img src={logo} alt="Logo" height="100" className="d-inline-block align-text-top" />
      </Link>
      <hr />
      <ul className="nav flex-column mb-auto ms-5">
        <li>
          <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </Link>
        </li>

        <li>
          <Link to="/admin/pedidos" className={linkClass("/admin/pedidos")}>
            <i className="bi bi-bag-check me-2"></i>Pedidos
          </Link>
        </li>

        {/* Nueva opción: Productos */}
        <li>
          <Link to="/admin/productos" className={linkClass("/admin/productos")}>
            <i className="bi bi-box me-2"></i>Productos
          </Link>
        </li>

        <li>
          <a href="#" className="nav-link text-dark">
            <i className="bi bi-box-seam me-2"></i>Inventario
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-dark">
            <i className="bi bi-bar-chart-line me-2"></i>Reportes
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-dark">
            <i className="bi bi-people me-2"></i>Empleados
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-dark">
            <i className="bi bi-person me-2"></i>Clientes
          </a>
        </li>
      </ul>

      <div className="mt-auto">
        <ul className="nav flex-column mb-auto ms-5">
          <li>
            <a href="#" className="nav-link text-dark">
              <i className="bi bi-gear me-2"></i>Configuración
            </a>
          </li>
          <li>
            <a href="#" className="nav-link text-dark">
              <i className="bi bi-people me-2"></i>Perfiles
            </a>
          </li>
          <li>
            <a href="#" className="nav-link text-dark">
              <i className="bi bi-search me-2"></i>Buscar
            </a>
          </li>
          <li>
            <a href="#" className="nav-link text-dark">
              <i className="bi bi-question-circle me-2"></i>Ayuda
            </a>
          </li>
        </ul>
        <hr />
        <Link to="/perfil" className="nav-link text-center me-5 text-dark">
          <i className="bi bi-person-circle me-2"></i>Perfil
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;
