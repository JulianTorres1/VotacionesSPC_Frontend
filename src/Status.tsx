import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const normalizeUrl = (value?: string | null) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `http:${trimmed}`;
  return `http://${trimmed}`;
};

const apiBaseUrl = normalizeUrl(API_URL).replace(/\/+$/, "");

const fetchWithTimeout = async (url: string, timeoutMs: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

function Status() {
  const [representantes, setRepresentantes] = useState([]);
  const [personeros, setPersoneros] = useState([]);
  const [consejo, setConsejo] = useState([]);
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiBaseUrl) {
      setRequestError("VITE_API_URL no está configurada correctamente.");
      return;
    }

    fetchWithTimeout(`${apiBaseUrl}/getCandidateVotes`, 10000)
      .then((response) => response.json())
      .then((data) => {
        // Filtrar datos por grupo
        const reps = data.filter(
          (c) =>
            c.grupo !== "Personero" &&
            c.grupo !== "Consejo" &&
            !isNaN(Number(c.grupo)), // Verifica si el grupo es un número
        );
        const pers = data.filter((c) => c.grupo === "Personero");
        const cons = data.filter((c) => c.grupo === "Consejo");

        setRepresentantes(reps);
        setPersoneros(pers);
        setConsejo(cons);
        setRequestError(null);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setRequestError("No se pudo cargar el estado de votaciones.");
      });
  }, []);

  // Función para renderizar una gráfica
  const renderChart = (title, data) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="candidato" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_votos" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-darker via-primary-dark to-primary">
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Estado de Votaciones
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-full mx-auto px-8 py-8">
        {requestError && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            {requestError}
          </div>
        )}
        {renderChart("Conteo de votos: Representantes", representantes)}
        {renderChart("Conteo de votos: Personería", personeros)}
        {renderChart("Conteo de votos: Consejo", consejo)}
      </main>

      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-sm text-primary-dark/60">
            © {new Date().getFullYear()} Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Status;
