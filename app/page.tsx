"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Vulnerabilidad {
  id: string;
  nombre: string;
  riesgo: string;
  fecha: string;
}

const LOCAL_STORAGE_KEY = "vulnerabilidades";

export default function Home() {
  const [vulnerabilidades, setVulnerabilidades] = useState<Vulnerabilidad[]>([]);
  const [filtroRiesgo, setFiltroRiesgo] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("Todos");

  useEffect(() => {
    const datosLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (datosLocal) {
      try {
        setVulnerabilidades(JSON.parse(datosLocal));
      } catch {
        setVulnerabilidades([]);
      }
    } else {
      fetch("/data/vulnerabilidades.json")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setVulnerabilidades(data);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        })
        .catch(() => {
          setVulnerabilidades([]);
        });
    }
  }, []);

  // Únicos para filtros
  const tiposUnicos = [...new Set(vulnerabilidades.map((v) => v.nombre))];
  const fechasUnicas = [...new Set(vulnerabilidades.map((v) => v.fecha))];

  // Filtrar
  const filtradas = vulnerabilidades.filter((v) => {
    const r = filtroRiesgo === "Todos" || v.riesgo === filtroRiesgo;
    const t = filtroTipo === "Todos" || v.nombre === filtroTipo;
    const f = filtroFecha === "Todos" || v.fecha === filtroFecha;
    return r && t && f;
  });

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] text-white font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-center bg-[#0f2027] px-6 py-4 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold">
          PROYECTO INKA{" "}
          <span className="text-cyan-400">Seguridad Cibernética</span>
        </h1>
        <Link
          href="/administracion"
          className="mt-4 sm:mt-0 bg-cyan-700 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded"
        >
          Administración
        </Link>
      </header>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <select
          className="p-2 rounded bg-gray-800 text-white border border-cyan-700"
          value={filtroRiesgo}
          onChange={(e) => setFiltroRiesgo(e.target.value)}
        >
          <option key="TodosRiesgo" value="Todos">
            Nivel de riesgo
          </option>
          <option key="Crítico" value="Crítico">
            Crítico
          </option>
          <option key="Alto" value="Alto">
            Alto
          </option>
          <option key="Medio" value="Medio">
            Medio
          </option>
          <option key="Bajo" value="Bajo">
            Bajo
          </option>
        </select>

        <select
          className="p-2 rounded bg-gray-800 text-white border border-cyan-700"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option key="TodosTipo" value="Todos">
            Tipo de vulnerabilidad
          </option>
          {tiposUnicos.map((tipo, idx) => (
            <option key={`tipo-${idx}`} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        <select
          className="p-2 rounded bg-gray-800 text-white border border-cyan-700"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        >
          <option key="TodosFecha" value="Todos">
            Fecha de detección
          </option>
          {fechasUnicas.map((fecha, idx) => (
            <option key={`fecha-${idx}`} value={fecha}>
              {fecha}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <section className="mt-10 overflow-x-auto">
        <h2 className="text-xl font-semibold text-center mb-4 text-white">
          Lista de Vulnerabilidades Detectadas
        </h2>
        <table className="min-w-full bg-white text-black rounded-md overflow-hidden shadow-lg">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Nivel de riesgo</th>
              <th className="py-2 px-4 text-left">Fecha</th>
              <th className="py-2 px-4 text-left">Ver Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length > 0 ? (
              filtradas.map((v) => (
                <tr key={v.id} className="border-t border-gray-300">
                  <td className="py-2 px-4">{v.nombre}</td>
                  <td className="py-2 px-4">{v.riesgo}</td>
                  <td className="py-2 px-4">{v.fecha}</td>
                  <td className="py-2 px-4">
                    <Link
                      href={`/vulnerabilidad/${v.id}`}
                      className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold py-1 px-3 rounded"
                    >
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 text-gray-600 font-semibold"
                >
                  No hay vulnerabilidades que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <footer className="w-full text-center mt-10 py-4 border-t border-cyan-800 text-gray-400">
        © {new Date().getFullYear()} Proyecto INKA
      </footer>
    </div>
  );
}
