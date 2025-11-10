import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// ✅ Convertir cualquier archivo en Base64
const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const nombreRef = useRef(null);

  // ✅ FORMULARIO
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    categoria: "",
    disponible: true,
    imagen: "",
    imagenes: [],
  });

  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState("");

  // ============================
  // ✅ Cargar producto desde API
  // ============================
  const cargarProducto = async () => {
    try {
      const res = await fetch(`http://localhost:8090/api/productos/${id}`);
      if (!res.ok) throw new Error("Producto no encontrado");

      const data = await res.json();

      setForm({
        nombre: data.nombre,
        precio: data.precio,
        descripcion: data.descripcion,
        categoria: data.categoria,
        disponible: data.disponible,
        imagen: data.imagen ? `data:image/jpeg;base64,${data.imagen}` : "",
        imagenes: data.imagenes
          ? data.imagenes.map((img) => `data:image/jpeg;base64,${img}`)
          : [],
      });

      nombreRef.current?.focus();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarProducto();
  }, [id]);

  // ===========================
  // ✅ Manejo de campos
  // ===========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ==============================
  // ✅ Reemplazar imagen principal
  // ==============================
  const handleImagenPrincipal = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await readFileAsBase64(file);
    setForm({ ...form, imagen: `data:image/jpeg;base64,${base64}` });
  };

  // ==============================
  // ✅ Agregar imágenes adicionales
  // ==============================
  const handleGaleria = async (e) => {
    const files = Array.from(e.target.files || []);
    const base64List = await Promise.all(files.map(readFileAsBase64));

    setForm((prev) => ({
      ...prev,
      imagenes: [
        ...prev.imagenes,
        ...base64List.map((b64) => `data:image/jpeg;base64,${b64}`),
      ],
    }));
  };

  // ============================
  // ✅ Validación
  // ============================
  const validar = () => {
    const e = {};

    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.precio || Number(form.precio) < 0)
      e.precio = "El precio debe ser válido.";
    if (!form.categoria.trim()) e.categoria = "La categoría es obligatoria.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ============================
  // ✅ Guardar cambios en la API
  // ============================
  const handleGuardar = async () => {
    if (!validar()) return;

    try {
      const payload = {
        nombre: form.nombre,
        precio: Number(form.precio),
        descripcion: form.descripcion,
        categoria: form.categoria,
        disponible: form.disponible,
        imagen: form.imagen ? form.imagen.split(",")[1] : null,
        imagenes: form.imagenes.map((img) =>
          img.startsWith("data:image") ? img.split(",")[1] : img
        ),
      };

      const res = await fetch(`http://localhost:8090/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar");

      setMensaje("✅ Cambios guardados correctamente.");
      setTimeout(() => navigate("/admin/productos"), 1500);
    } catch (err) {
      console.error(err);
      setMensaje("❌ Ocurrió un error al guardar.");
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <main className="p-4 w-100 d-flex justify-content-center align-items-start">
        <div className="card shadow-sm p-4 mt-4" style={{ maxWidth: 720 }}>

          {/* Botón Volver */}
          <button className="btn p-0 mb-2" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Volver
          </button>

          <h2 className="fw-bold text-success text-center mb-3">
            Editar producto
          </h2>

          {/* FORMULARIO */}
          <form onSubmit={(e) => e.preventDefault()}>

            {/* === NOMBRE + PRECIO === */}
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

            {/* === CATEGORÍA + DISPONIBLE === */}
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Categoría</label>
                <select
                  name="categoria"
                  className={`form-select ${errors.categoria ? "is-invalid" : ""}`}
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

            {/* === DESCRIPCIÓN === */}
            <label className="form-label fw-semibold mt-3">Descripción</label>
            <textarea
              name="descripcion"
              className="form-control"
              rows="3"
              value={form.descripcion}
              onChange={handleChange}
            />

            {/* === IMAGEN PRINCIPAL === */}
            <label className="form-label fw-semibold mt-3">Imagen principal</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImagenPrincipal}
            />

            {form.imagen && (
              <div
                className="mt-3 rounded border d-flex justify-content-center align-items-center"
                style={{
                  width: "180px",
                  height: "180px",
                  overflow: "hidden",
                  background: "#f8f9fa",
                }}
              >
                <img
                  src={form.imagen}
                  alt="Principal"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* === GALERÍA === */}
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

            <div
              className="mt-3"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
              }}
            >
              {form.imagenes.map((img, i) => (
                <div
                  key={i}
                  className="rounded border"
                  style={{
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    background: "#f8f9fa",
                  }}
                >
                  <img
                    src={img}
                    alt="Galería"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* === BOTÓN GUARDAR === */}
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleGuardar}
              >
                <i className="bi bi-save me-2"></i> Guardar Cambios
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
