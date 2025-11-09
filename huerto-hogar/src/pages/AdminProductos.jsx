import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import productosData from "../data/productos";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminProductos() {
  // 🔹 Cargar desde localStorage si hay datos guardados
  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem("productos");
    return guardados ? JSON.parse(guardados) : productosData;
  });

  const navigate = useNavigate();

  // 🔹 Guardar cambios en localStorage cada vez que cambien los productos
  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  const handleEliminar = (slug) => {
    const producto = productos.find((p) => p.slug === slug);
    if (!producto) return;

    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar "${producto.nombre}"?`
    );

    if (confirmar) {
      setProductos(productos.filter((p) => p.slug !== slug));
      alert(`Producto "${producto.nombre}" eliminado correctamente.`);
    }
  };

  const handleEditar = (slug) => {
    const producto = productos.find((p) => p.slug === slug);
    if (producto) {
      navigate("/admin/editar", { state: { producto } });
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <main className="p-4 w-100">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Gestión de Productos</h2>
          <button
            className="btn btn-success"
            onClick={() => navigate("/admin/crear")}
          >
            <i className="bi bi-plus-circle me-2"></i> Añadir Producto
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-success">
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.slug}>
                  <td style={{ width: "100px" }}>
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="img-fluid rounded"
                      style={{ height: "60px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio.toLocaleString("es-CL")}</td>
                  <td>{producto.categoria}</td>
                  <td>
                    {producto.disponible ? (
                      <span className="badge bg-success">Sí</span>
                    ) : (
                      <span className="badge bg-secondary">No</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEditar(producto.slug)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleEliminar(producto.slug)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminProductos;
