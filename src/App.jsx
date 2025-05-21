import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';

import Login from './pages/Login';
import Signup from './pages/Signup';

import Characters from './pages/Characters';
import ItemDetailsPage from './pages/ItemDetailsPage';
import CharacterCreate from './pages/CharacterCreate';
import CharacterDetail from './pages/CharacterDetail';

import Items from './pages/Items';
import CreateItem from './pages/CreateItem';
import EditItem from './pages/EditItem';
import Profile from './pages/Profile';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/create" element={<CharacterCreate />} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/create" element={<CreateItem/>}/>
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        <Route path="/items/:id/edit" element={<EditItem />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;

