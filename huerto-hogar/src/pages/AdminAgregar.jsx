// ✅ AdminAgregar.jsx — usando SIEMPRE 8090

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminAgregar() {
  const navigate = useNavigate();
  const nombreRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    disponible: true,
    categoria: "",
    imagen: "",
    imagenes: [],
  });

  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    nombreRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImagenPrincipal = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readFileAsBase64(file);
    setForm((prev) => ({ ...prev, imagen: base64 }));
  };

  const handleGaleria = async (e) => {
    const files = Array.from(e.target.files || []);
    const base64List = await Promise.all(files.map(readFileAsBase64));
    setForm((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, ...base64List],
    }));
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.precio || Number(form.precio) < 0)
      e.precio = "El precio debe ser válido.";
    if (!form.categoria.trim())
      e.categoria = "Debes seleccionar una categoría.";
    if (!form.imagen) e.imagen = "Debes subir una imagen principal.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const payload = {
      ...form,
      precio: Number(form.precio),
    };

    try {
      const res = await fetch("http://localhost:8090/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      setMensaje("✅ Producto guardado correctamente.");
      setTimeout(() => navigate("/admin/productos"), 1200);
    } catch (error) {
      setMensaje("❌ Error al guardar el producto.");
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <main className="p-4 w-100 d-flex justify-content-center align-items-start">
        <div className="card shadow-sm p-4 mt-4" style={{ maxWidth: 720 }}>
          <button className="btn p-0 mb-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Volver
          </button>

          <h2 className="fw-bold text-success text-center mb-3">
            Agregar nuevo producto
          </h2>

          <form onSubmit={handleGuardar}>
            {/* Nombre + Precio */}
            <div className="row g-3">
              <div className="col-md-7">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  ref={nombreRef}
                  type="text"
                  name="nombre"
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  value={form.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && (
                  <div className="invalid-feedback">{errors.nombre}</div>
                )}
              </div>

              <div className="col-md-5">
                <label className="form-label fw-semibold">Precio (CLP)</label>
                <input
                  type="number"
                  name="precio"
                  className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                  value={form.precio}
                  onChange={handleChange}
                />
                {errors.precio && (
                  <div className="invalid-feedback">{errors.precio}</div>
                )}
              </div>
            </div>

            {/* Categoría + Disponible */}
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Categoría</label>
                <select
                  name="categoria"
                  className={`form-select ${
                    errors.categoria ? "is-invalid" : ""
                  }`}
                  value={form.categoria}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Fruta">Fruta</option>
                  <option value="Verdura">Verdura</option>
                  <option value="Orgánicos">Orgánicos</option>
                </select>
                {errors.categoria && (
                  <div className="invalid-feedback d-block">
                    {errors.categoria}
                  </div>
                )}
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <div className="form-check form-switch mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="disponible"
                    checked={form.disponible}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Disponible</label>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <label className="form-label fw-semibold mt-3">Descripción</label>
            <textarea
              name="descripcion"
              className="form-control"
              rows="3"
              value={form.descripcion}
              onChange={handleChange}
            />

            {/* Imagen principal */}
            <label className="form-label fw-semibold mt-3">
              Imagen principal
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImagenPrincipal}
            />
            {errors.imagen && (
              <div className="invalid-feedback d-block">{errors.imagen}</div>
            )}

            {/* Galería */}
            <label className="form-label fw-semibold mt-3">
              Imágenes adicionales
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="form-control"
              onChange={handleGaleria}
            />

            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-success">
                <i className="bi bi-save me-2"></i> Guardar
              </button>
            </div>

            {mensaje && (
              <div className="mt-3 text-center fw-semibold">{mensaje}</div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
