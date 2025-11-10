// ✅ AdminProductos.jsx — TODAS las llamadas ahora usan 8090

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const cargarProductos = async () => {
    try {
      const res = await fetch("http://localhost:8090/api/productos");
      const data = await res.json();

      const productosConvertidos = data.map((p) => ({
        ...p,
        imagen: p.imagen ? `data:image/jpeg;base64,${p.imagen}` : "",
      }));

      setProductos(productosConvertidos);
    } catch (error) {
      console.log("Error cargando productos:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el producto "${nombre}"?`)) return;

    try {
      await fetch(`http://localhost:8090/api/productos/${id}`, {
        method: "DELETE",
      });

      cargarProductos();
    } catch (error) {
      alert("Error al eliminar producto");
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <main className="p-4 w-100">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestión de Productos</h2>

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
                <tr key={producto.id}>
                  <td style={{ width: "100px" }}>
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      style={{
                        height: "60px",
                        width: "100%",
                        objectFit: "cover",
                      }}
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
                      onClick={() => navigate(`/admin/editar/${producto.id}`)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        handleEliminar(producto.id, producto.nombre)
                      }
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
