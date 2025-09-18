"use client"; //se actualiza
import { useState, useEffect } from "react";
import Link from "next/link";

interface Vulnerabilidad {
  id: string;
  nombre: string;
  descripcion: string;
  riesgo: string;
  fecha: string; // ✅ nuevo campo
}

const LOCAL_STORAGE_KEY = "vulnerabilidades";

export default function Administracion() {
  const [vulnerabilidades, setVulnerabilidades] = useState<Vulnerabilidad[]>([]);
  const [nueva, setNueva] = useState({ nombre: "", descripcion: "", riesgo: "Bajo", fecha: "" });
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    const datosLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (datosLocal) {
      try {
        const parsed = JSON.parse(datosLocal);
        setVulnerabilidades(parsed);
        console.log("Datos cargados de localStorage:", parsed);
      } catch {
        console.warn("No se pudo parsear localStorage, cargando JSON...");
        cargarDesdeJson();
      }
    } else {
      cargarDesdeJson();
    }
  }, []);

  const cargarDesdeJson = () => {
    fetch("/vulnerabilidades.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data: Vulnerabilidad[]) => {
        setVulnerabilidades(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        console.log("Datos cargados desde JSON:", data);
      })
      .catch((error) => {
        console.error("Error cargando vulnerabilidades:", error);
      });
  };

  const guardarCambios = (datos: Vulnerabilidad[]) => {
    setVulnerabilidades(datos);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(datos));
  };

  const agregarOActualizar = () => {
    if (!nueva.nombre.trim() || !nueva.descripcion.trim()) return;

    if (editandoId) {
      const actualizadas = vulnerabilidades.map((v) =>
        v.id === editandoId ? { ...v, ...nueva } : v
      );
      guardarCambios(actualizadas);
      setEditandoId(null);
    } else {
      const nuevaVuln: Vulnerabilidad = {
        id: Date.now().toString(),
        ...nueva,
      };
      guardarCambios([...vulnerabilidades, nuevaVuln]);
    }

    setNueva({ nombre: "", descripcion: "", riesgo: "Bajo", fecha: "" });
  };

  const cargarParaEditar = (v: Vulnerabilidad) => {
    setNueva({ nombre: v.nombre, descripcion: v.descripcion, riesgo: v.riesgo, fecha: v.fecha ?? "" });
    setEditandoId(v.id);
  };

  const eliminarVulnerabilidad = (id: string) => {
    const filtradas = vulnerabilidades.filter((v) => v.id !== id);
    guardarCambios(filtradas);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] text-white p-6">
      <Link
        href="/"
        className="inline-block mb-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded"
      >
        ← Volver al Inicio
      </Link>

      <h1 className="text-3xl font-bold mb-6">Administración de Vulnerabilidades</h1>

      {/* Formulario */}
      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Nombre"
          value={nueva.nombre}
          onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white w-full"
        />
        <textarea
          placeholder="Descripción"
          value={nueva.descripcion}
          onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white w-full"
          rows={4}
        />
        <select
          value={nueva.riesgo}
          onChange={(e) => setNueva({ ...nueva, riesgo: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white w-full"
        >
          <option value="Bajo">Bajo</option>
          <option value="Medio">Medio</option>
          <option value="Alto">Alto</option>
          <option value="Crítico">Crítico</option>
        </select>
        <input
          type="date"
          value={nueva.fecha}
          onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white w-full"
        />
        <div className="flex gap-4">
          <button
            onClick={agregarOActualizar}
            className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
            disabled={!nueva.nombre.trim() || !nueva.descripcion.trim()}
          >
            {editandoId ? "Guardar Cambios" : "Agregar Vulnerabilidad"}
          </button>
          {editandoId && (
            <button
              onClick={() => {
                setEditandoId(null);
                setNueva({ nombre: "", descripcion: "", riesgo: "Bajo", fecha: "" });
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <table className="min-w-full bg-white text-black rounded shadow-lg">
        <thead className="bg-gray-200 text-gray-800">
          <tr>
            <th className="py-2 px-4 text-center">Nombre</th>
            <th className="py-2 px-4 text-center">Descripción</th>
            <th className="py-2 px-4 text-center">Riesgo</th>
            <th className="py-2 px-4 text-center">Fecha</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vulnerabilidades.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No hay vulnerabilidades registradas.
              </td>
            </tr>
          ) : (
            vulnerabilidades.map((v) => (
              <tr key={v.id} className="border-t border-gray-300">
                <td className="py-2 px-4 text-center">{v.nombre}</td>
                <td className="py-2 px-4 text-center">{v.descripcion}</td>
                <td className="py-2 px-4 font-semibold text-center">{v.riesgo}</td>
                <td className="py-2 px-4 text-center">{v.fecha ?? "Sin fecha"}</td>
                <td className="py-2 px-4 flex gap-2 justify-center">
                  <button
                    onClick={() => cargarParaEditar(v)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-white py-1 px-3 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarVulnerabilidad(v.id)}
                    className="bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
