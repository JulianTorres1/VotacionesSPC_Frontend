import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { School, Vote, MapPin, Phone, Mail, Globe, Heart, Book } from 'lucide-react';
import LogoSalesianos from './media/img/logoSPC.png';
import LogoPacto from './media/img/logoPacto.png';
import axios from 'axios';
import Status from './Status.tsx';
import sena from './media/img/logoSena.png';
import bgImage from './media/img/bg.jpg';

type Course = {
  id: string;
  name: string;
};

interface Candidate {
  id_candidato: string;
  nombre: string;
  grupo: string;
  biografia: string;
  foto_url: string;
}

const courses: Course[] = [
  { id: '3', name: '3°' },
  { id: '4', name: '4°' },
  { id: '5', name: '5°' },
  { id: '6', name: '6°' },
  { id: '7', name: '7°' },
  { id: '8', name: '8°' },
  { id: '9', name: '9°' },
  { id: '10', name: '10°' },
  { id: '11', name: '11°' },
];


const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL);

// Add a new state variable to track voting stages
function App() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votingStage, setVotingStage] = useState<'course' | 'personero' | 'consejo'>('course');
  const [votingComplete, setVotingComplete] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/getCandidatos`)
      .then(response => {
        setCandidates(response.data);
      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
      });
  }, []);

  // Add this helper function at the top of your App component
  const getCardBackgroundColor = (nombre: string) => {
    const numero = nombre.substring(0, 2);
    switch (numero) {
      case '01':
        return 'bg-yellow-300';
      case '02':
        return 'bg-blue-300';
      case '03':
        return 'bg-red-300';
      case '04':
        return 'bg-green-300';
      default:
        return 'bg-white';
    }
  };

  // Modify the handleVote function
  const handleVote = (candidateId: string) => {
    console.log('Voting for candidate:', candidateId);
    axios.post(`${API_URL}/create`, { id_candidato: candidateId })
      .then(() => {
        if (votingStage === 'course') {
          setVotingStage('personero');
        } else if (votingStage === 'personero') {
          setVotingStage('consejo');
        } else {
          setVotingComplete(true);
        }
      })
      .catch(error => {
        console.error('Error voting:', error);
        alert('Hubo un error al votar. Por favor, intenta de nuevo.');
      });
  };

  // Modify the main content rendering
  return (
    <Router>
      <Routes>
        <Route path="/status" element={<Status />} />
        <Route path="/" element={
          <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }}>
            <header className="bg-white shadow-lg">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                  <div className="flex items-center gap-10">
                    <img src={LogoSalesianos} alt="Logo Salesianos" className="w-auto h-16" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                      Sistema de Votación Estudiantil 2025
                    </h1>
                  </div>
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img src={LogoPacto} alt="Logo Pacto" className="" />
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-grow max-w-7xl mx-auto px-4 py-8">
              {votingComplete ? (
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-secondary-yellow max-w-md">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">
                      ¡Votación Completada!
                    </h2>
                    <p className="text-primary-dark/80 mb-6">
                      Has completado exitosamente tu proceso de votación. Gracias por participar en la democracia estudiantil.
                    </p>
                    <button
                      onClick={() => {
                        setVotingComplete(false);
                        setSelectedCourse(null);
                        setVotingStage('course');
                      }}
                      className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors duration-200"
                      id='aceptar'
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {votingStage === 'course' && !selectedCourse ? (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-bold text-white">
                        Selecciona tu curso
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => setSelectedCourse(course.id)}
                            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-2 border-secondary-yellow hover:border-secondary-orange"
                          >
                            <div className="flex items-center gap-3">
                              <Book className="w-6 h-6 text-primary" />
                              <span className="text-lg font-medium text-primary-dark">
                                {course.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-white ">
                          {votingStage === 'personero' 
                            ? 'Selecciona tu personero' 
                            : votingStage === 'consejo' 
                              ? 'Selecciona tu representante al Consejo'
                              : 'Selecciona tu Representante de Curso'
                          }
                        </h2>
                        <button
                          onClick={() => {
                            setSelectedCourse(null);
                            setVotingStage('course');
                          }}
                          className="bg-white text-primary-dark hover:text-secondary-orange font-semibold px-4 py-2 rounded-md border-2 border-primary transition-colors duration-200"
                          id='volver'
                        >
                          Volver a cursos
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidates
                          .filter((candidate) => {
                            if (votingStage === 'personero') return candidate.grupo === 'Personero';
                            if (votingStage === 'consejo') return candidate.grupo === 'Consejo';
                            return candidate.grupo === selectedCourse;
                          })
                          .map((candidate) => (
                            <div
                              key={candidate.id_candidato}
                              className={`${getCardBackgroundColor(candidate.nombre)} rounded-lg shadow-md overflow-hidden border-2 border-secondary-yellow`}
                            >
                              <div className="w-full h-60 flex justify-center items-center bg-gray-200">
                                <img
                                  src={candidate.foto_url}
                                  alt={candidate.nombre}
                                  className="w-full h-full object-contain"
                                  style={{ aspectRatio: "4/3" }}
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="text-lg font-semibold text-primary-dark">
                                  {candidate.nombre}
                                </h3>
                                <p className="text-primary-dark/80 mt-2">{candidate.biografia}</p>
                                <button
                                  className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center gap-2"
                                  onClick={() => handleVote(candidate.id_candidato)}
                                >
                                  <Vote id='votar' className="w-5 h-5" />
                                  Votar
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>

            <footer className="bg-white mt-auto">
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <School className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-bold text-primary-dark">
                        Colegio Salesiano San Pedro Claver
                      </h3>
                    </div>
                    <div className="space-y-2 text-primary-dark/80">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Cartagena de Indias, Colombia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>+57 (605) 6600094</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>sistemas.spc@salesianos.edu.co</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a 
                          href="https://www.salesianoscartagena.edu.co" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark"
                        >
                          www.salesianoscartagena.edu.co
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center md:items-end space-y-2">
                    <div className="flex items-center gap-2 text-primary-dark">
                      <span>Desarrollado con</span>
                      <Heart className="w-4 h-4 text-primary fill-current" />
                      <span>por</span>
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      Nicolas Torres
                      <img src={sena} alt="Logo Sena" className="inline-block w-6 h-6 ml-2" />
                    </div>
                    <div className="text-sm text-primary-dark/60">
                      © {new Date().getFullYear()} Todos los derechos reservados
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;