import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';

import Login from './pages/AuthPages/Login';
import Signup from './pages/AuthPages/Signup';

import Characters from './pages/CharacterPages/Characters';
import CharacterCreate from './pages/CharacterPages/CharacterCreate';
import CharacterDetail from './pages/CharacterPages/CharacterDetail';
import EditCharacter from './pages/CharacterPages/EditCharacter';

import Items from './pages/ItemPages/Items';
import ItemDetailsPage from './pages/ItemPages/ItemDetailsPage';
import CreateItem from './pages/ItemPages/CreateItem';
import EditItem from './pages/ItemPages/EditItem';

import Spells from './pages/SpellPages/Spells';
import CreateSpell from './pages/SpellPages/CreateSpell'
import SpellDetailsPage from './pages/SpellPages/SpellDetailsPage';
import EditSpell from './pages/SpellPages/EditSpell';

import Profile from './pages/ProfilePages/Profile';
import EditProfile from './pages/ProfilePages/EditProfile';



function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="MainContent">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/create" element={<CharacterCreate />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />
          <Route path="/characters/:id/edit" element={<EditCharacter />} />

          <Route path="/items" element={<Items />} />
          <Route path="/items/create" element={<CreateItem />} />
          <Route path="/items/:id" element={<ItemDetailsPage />} />
          <Route path="/items/:id/edit" element={<EditItem />} />

          <Route path="/spells" element={<Spells />} />
          <Route path="/spells/create" element={<CreateSpell />} />
          <Route path="/spells/:id" element={<SpellDetailsPage />} />
          <Route path="/spells/edit/:id" element={<EditSpell />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

