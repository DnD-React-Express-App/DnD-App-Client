import './App.css';
import { Routes, Route } from 'react-router-dom';

//import Home from './pages/Home';
import Login from './pages/Login';
//import Signup from './pages/Signup';
import Characters from './pages/Characters';
//import Items from './pages/Items';

function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/characters" element={<Characters />} />
      </Routes>
    </div>
  );
}

export default App;

/*
<Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/items" element={<Items />} />
*/