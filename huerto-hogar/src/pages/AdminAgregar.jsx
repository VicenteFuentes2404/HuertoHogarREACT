import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// ===== Utils =====
const normalizeCLP = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num);
};

const slugify = (txt) =>
  String(txt || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

export default function AdminAgregar() {
  const navigate = useNavigate();

  // Cargar productos existentes
  const productosExistentes = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("productos")) || [];
    } catch {
      return [];
    }
  }, []);

  // ===== Form state =====
  const [form, setForm] = useState({
    nombre: "",
    slug: "",
    precio: "",
    descripcion: "",
    // imagen principal (DataURL)
    imagen: "",
    // galería (DataURLs)
    imagenes: [],
    disponible: true,
    categoria: "",
  });

  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [dirty, setDirty] = useState(false);

  const nombreRef = useRef(null);
  const galeriaInputRef = useRef(null);

  useEffect(() => {
    nombreRef.current?.focus();
  }, []);

  // Proteger salida con cambios sin guardar
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Autogenerar slug a partir de nombre (si el usuario no lo tocó manualmente)
  const [slugTouched, setSlugTouched] = useState(false);
  useEffect(() => {
    if (!slugTouched) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.nombre) }));
    }
  }, [form.nombre, slugTouched]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setDirty(true);
  };

  const handleSlugChange = (e) => {
    setSlugTouched(true);
    const value = slugify(e.target.value);
    setForm((prev) => ({ ...prev, slug: value }));
    setDirty(true);
  };

  // Imagen principal desde PC
  const handleImagenPrincipal = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setForm((prev) => ({ ...prev, imagen: dataUrl }));
      setDirty(true);
    } catch {
      setErrors((prev) => ({ ...prev, imagen: "No se pudo leer la imagen." }));
    }
  };

  // Galería múltiple desde PC
  const handleGaleriaArchivos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const dataUrls = await Promise.all(files.map(readFileAsDataURL));
      setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, ...dataUrls] }));
      setDirty(true);
      if (galeriaInputRef.current) galeriaInputRef.current.value = "";
    } catch {
      // noop
    }
  };

  const removeImagenExtra = (idx) => {
    setForm((prev) => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== idx) }));
    setDirty(true);
  };

  const validar = () => {
    const e = {};
    if (!String(form.nombre).trim()) e.nombre = "El nombre es obligatorio.";

    const slug = slugify(form.slug);
    if (!slug) e.slug = "El slug es obligatorio.";
    const slugExiste = productosExistentes.some((p) => p.slug === slug);
    if (slugExiste) e.slug = "Este slug ya existe. Elige otro.";

    const precioNum = Number(form.precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) e.precio = "El precio debe ser un número válido ≥ 0.";

    if (!String(form.categoria).trim()) e.categoria = "La categoría es obligatoria.";

    // imagen principal requerida
    if (!form.imagen) e.imagen = "Debes seleccionar una imagen principal.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = (e) => {
    e?.preventDefault?.();
    if (!validar()) return;

    const nuevo = {
      slug: slugify(form.slug),
      nombre: form.nombre.trim(),
      precio: normalizeCLP(form.precio),
      descripcion: form.descripcion?.trim() || "",
      imagen: form.imagen, // DataURL
      imagenes: form.imagenes.filter(Boolean), // DataURLs
      disponible: !!form.disponible,
      categoria: form.categoria.trim(),
    };

    // ⚠️ Almacenar DataURLs en localStorage consume bastante espacio (~5MB por dominio)
    const lista = JSON.parse(localStorage.getItem("productos")) || [];
    const existe = lista.some((p) => p.slug === nuevo.slug);
    if (existe) {
      setErrors((prev) => ({ ...prev, slug: "Este slug ya existe. Elige otro." }));
      return;
    }

    const nuevaLista = [...lista, nuevo];
    try {
      localStorage.setItem("productos", JSON.stringify(nuevaLista));
    } catch (err) {
      setMensaje("⚠️ No se pudo guardar. El almacenamiento puede estar lleno.");
      return;
    }

    setMensaje("✅ Producto creado con éxito.");
    setDirty(false);

    const t = setTimeout(() => {
      setMensaje("");
      navigate("/admin/productos");
    }, 1200);
    return () => clearTimeout(t);
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <main className="p-4 w-100 d-flex justify-content-center align-items-start">
        <div className="card shadow-sm p-4 mt-4" style={{ maxWidth: 720, width: "100%", borderRadius: "1rem" }}>
          <div className="mb-4">
            <button className="btn p-0 mb-2" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left"></i> Volver
            </button>
            <h2 className="fw-bold text-success text-center mb-1">Agregar nuevo producto</h2>
          </div>

          <form onSubmit={handleGuardar} autoComplete="off">
            {/* Nombre y Slug */}
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
                  placeholder="Pimientos Tricolores"
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>
              <div className="col-md-5">
                <label className="form-label fw-semibold">URL</label>
                <div className="input-group">
                  <span className="input-group-text">/producto/</span>
                  <input
                    type="text"
                    name="slug"
                    className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                    value={form.slug}
                    onChange={handleSlugChange}
                    placeholder="pimientos-tricolores"
                  />
                </div>
                {errors.slug && <div className="invalid-feedback d-block">{errors.slug}</div>}
              </div>
            </div>

            {/* Precio y Categoría */}
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Precio (CLP)</label>
                <input
                  type="number"
                  name="precio"
                  className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                  value={form.precio}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="1500"
                />
                {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
              </div>
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
                {errors.categoria && <div className="invalid-feedback d-block">{errors.categoria}</div>}
              </div>
            </div>

            {/* Disponible */}
            <div className="form-check form-switch my-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="disponible"
                checked={form.disponible}
                onChange={handleChange}
                id="disponible"
              />
              <label className="form-check-label" htmlFor="disponible">Disponible</label>
            </div>

            {/* Descripción */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Descripción</label>
              <textarea
                name="descripcion"
                className="form-control"
                rows={3}
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Ideales para salteados."
              />
            </div>

            {/* Imagen principal (desde PC) */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Imagen principal</label>
              <input
                type="file"
                accept="image/*"
                className={`form-control ${errors.imagen ? "is-invalid" : ""}`}
                onChange={handleImagenPrincipal}
              />
              {errors.imagen && <div className="invalid-feedback d-block">{errors.imagen}</div>}
              {form.imagen && (
                <div className="mt-3 d-flex align-items-center gap-3">
                  <img
                    src={form.imagen}
                    alt="preview"
                    className="rounded"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                  <span className="text-muted small">Vista previa</span>
                </div>
              )}
            </div>

            {/* Galería (desde PC, múltiples) */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Imágenes adicionales</label>
              <input
                ref={galeriaInputRef}
                type="file"
                accept="image/*"
                multiple
                className="form-control"
                onChange={handleGaleriaArchivos}
              />
              {form.imagenes.length > 0 && (
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {form.imagenes.map((dataUrl, i) => (
                    <div key={i} className="position-relative">
                      <img
                        src={dataUrl}
                        alt={`img-${i}`}
                        className="rounded border"
                        style={{ width: 90, height: 90, objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-light border position-absolute top-0 end-0"
                        onClick={() => removeImagenExtra(i)}
                        title="Eliminar"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-success">
                <i className="bi bi-save me-1"></i> Crear producto
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin/productos")}>
                <i className="bi bi-list-ul me-1"></i> Ir al listado
              </button>
            </div>

            {mensaje && <div className="text-success text-center mt-3 fw-semibold">{mensaje}</div>}
          </form>
        </div>
      </main>
    </div>
  );
}