"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Vulnerabilidad {
  id: string;
  nombre: string;
  riesgo: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  soluciones: string[];
  recomendaciones: string;
}

export default function DetalleVulnerabilidad() {
  const { id } = useParams();
  const [vulnerabilidad, setVulnerabilidad] = useState<Vulnerabilidad | null>(null);

  useEffect(() => {
    fetch("/data/vulnerabilidades.json")
      .then((res) => res.json())
      .then((data: Vulnerabilidad[]) => {
        const encontrada = data.find((v) => v.id === id);
        setVulnerabilidad(encontrada || null);
      })
      .catch(() => setVulnerabilidad(null));
  }, [id]);

  if (!vulnerabilidad) {
    return (
      <div className="p-4 text-white">
        <p className="text-center">Cargando o no se encontró la vulnerabilidad...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] text-white p-6">
      <div className="max-w-3xl mx-auto bg-[#1a2a33] p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-cyan-400">{vulnerabilidad.nombre}</h1>

        <p><span className="font-semibold">Nivel de Riesgo:</span> {vulnerabilidad.riesgo}</p>
        <p><span className="font-semibold">Fecha:</span> {vulnerabilidad.fecha}</p>
        <p className="mt-4"><span className="font-semibold">Descripción:</span> {vulnerabilidad.descripcion}</p>
        <p className="mt-2"><span className="font-semibold">Categoría:</span> {vulnerabilidad.categoria}</p>

        <div className="mt-4">
          <h2 className="font-semibold">Soluciones:</h2>
          <ul className="list-disc ml-6 mt-2">
            {vulnerabilidad.soluciones.map((sol, i) => (
              <li key={i}>{sol}</li>
            ))}
          </ul>
        </div>

        <p className="mt-4"><span className="font-semibold">Recomendaciones:</span> {vulnerabilidad.recomendaciones}</p>

        <Link
          href="/"
          className="mt-6 inline-block bg-cyan-700 hover:bg-cyan-600 text-white py-2 px-4 rounded"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}
