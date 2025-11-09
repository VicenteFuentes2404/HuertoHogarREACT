import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminEditar() {
  const location = useLocation();
  const navigate = useNavigate();
  const producto = location.state?.producto;

  const [formData, setFormData] = useState({
    precio: "",
    categoria: "",
    disponible: true,
  });

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (producto) {
      setFormData({
        precio: producto.precio,
        categoria: producto.categoria,
        disponible: producto.disponible,
      });
    }
  }, [producto]);

  if (!producto) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <main className="p-4 w-100">
          <h5>No se encontró el producto.</h5>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => navigate("/admin/productos")}
          >
            Volver
          </button>
        </main>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleGuardar = () => {
    const productosGuardados =
      JSON.parse(localStorage.getItem("productos")) || [];

    const productosActualizados = productosGuardados.map((p) =>
      p.slug === producto.slug ? { ...p, ...formData } : p
    );

    localStorage.setItem("productos", JSON.stringify(productosActualizados));

    // Mostrar mensaje visual de confirmación
    setMensaje("✅ Cambios guardados correctamente.");

    // Ocultar mensaje y volver al listado
    setTimeout(() => {
      setMensaje("");
      navigate("/admin/productos");
    }, 1500);
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <main className="p-4 w-100 d-flex justify-content-center align-items-start">
        <div
          className="card shadow-sm p-4 mt-4"
          style={{ maxWidth: "480px", width: "100%", borderRadius: "1rem" }}
        >
          {/* Encabezado */}
          <div className="text-center mb-4 border-bottom pb-3">
            <h4 className="fw-bold text-success mb-3">
              Editar información del producto
            </h4>
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded mb-3"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
              }}
            />
            <h5 className="fw-semibold">{producto.nombre}</h5>
          </div>

          {/* Formulario */}
          <form autoComplete="off">
            <div className="mb-3">
              <label className="form-label fw-semibold">Precio</label>
              <input
                type="number"
                name="precio"
                className="form-control"
                value={formData.precio}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Categoría</label>
              <input
                type="text"
                name="categoria"
                className="form-control"
                value={formData.categoria}
                onChange={handleChange}
              />
            </div>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                name="disponible"
                checked={formData.disponible}
                onChange={handleChange}
                id="disponible"
              />
              <label className="form-check-label" htmlFor="disponible">
                Disponible
              </label>
            </div>
          </form>

          {/* Botones */}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              onClick={handleGuardar}
              className="btn btn-success btn-sm px-3"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-check-circle me-1"></i> Guardar
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm px-3"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/productos")}
            >
              <i className="bi bi-arrow-left me-1"></i> Volver
            </button>
          </div>

          {mensaje && (
            <div className="text-success text-center mt-3 fw-semibold">
              {mensaje}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminEditar;
