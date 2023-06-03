import './App.css'
import ContainerFluid from './components/ContainerFluid'

function App() {
  const searchParams = new URLSearchParams(document.location.search);
  return (
    <div className='App'>
      <ContainerFluid fileName={searchParams.get('fileName') || ''} />
    </div>
  )
}

export default App
