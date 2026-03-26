import './App.css'
import Navbar from './components/Navbar'
import WatchList from './components/WatchList'
import Movies from './components/Movies'
import MoodSelector from './components/MoodSelector'
import Home from './components/home'


import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/watchlist" element={<WatchList />} />
        <Route path="/mood" element={<MoodSelector />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App