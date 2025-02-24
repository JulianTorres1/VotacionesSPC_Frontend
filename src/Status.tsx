import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function Status() {
  const [votes, setVotes] = useState<{ id_candidato: string; votos: number }[]>([]);

  useEffect(() => {
    fetch('http://localhost:5005/votaciones/get')
      .then(response => response.json())
      .then(data => {
        const voteCount: { [key: string]: number } = {};
        
        data.forEach(vote => {
          voteCount[vote.id_candidato] = (voteCount[vote.id_candidato] || 0) + 1;
        });

        const chartData = Object.keys(voteCount).map(id => ({
          id_candidato: `Candidato ${id}`,
          votos: voteCount[id]
        }));

        setVotes(chartData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Conteo De votos: Personería
        </h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={votes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id_candidato" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votos" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
