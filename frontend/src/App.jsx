import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import FluxOrbDemo from './pages/FluxOrbDemo'
import ScrollWorld from './pages/ScrollWorld'
import CosmosWorld from './pages/CosmosWorld'
import Navbar from './components/ui/Navbar'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/flux-orb" element={<FluxOrbDemo />} />
          <Route path="/about" element={<About />} />
          <Route path="/prueba" element={<ScrollWorld />} />
          <Route path="/cosmos" element={<CosmosWorld />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
