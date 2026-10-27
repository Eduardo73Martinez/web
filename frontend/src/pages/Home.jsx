import { useEffect, useState } from 'react'
import axios from 'axios'

function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('/api/hello')
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        console.error('Error conectando al backend:', error)
        setMessage('No se pudo conectar con el backend. Asegúrate de que está corriendo en el puerto 8080.')
      })
  }, [])

  return (
    <div className="home">
      <h1>Bienvenido a la Web App</h1>
      <p>{message}</p>
    </div>
  )
}

export default Home
