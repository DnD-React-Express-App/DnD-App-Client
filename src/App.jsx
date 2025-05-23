import './App.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';

import Login from './pages/Login';
import Signup from './pages/Signup';

import Characters from './pages/Characters';
import CharacterCreate from './pages/CharacterCreate';
import CharacterDetail from './pages/CharacterDetail';
import EditCharacter from './pages/EditCharacter';

import Items from './pages/Items';
import ItemDetailsPage from './pages/ItemDetailsPage';
import CreateItem from './pages/CreateItem';
import EditItem from './pages/EditItem';

import Spells from './pages/Spells';
import CreateSpell from './pages/CreateSpell'
import SpellDetailsPage from './pages/SpellDetailsPage';
import EditSpell from './pages/EditSpell';

import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';



function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/create" element={<CharacterCreate />} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
        <Route path="/characters/:id/edit" element={<EditCharacter />} />

        <Route path="/items" element={<Items />} />
        <Route path="/items/create" element={<CreateItem/>}/>
        <Route path="/items/:id" element={<ItemDetailsPage />} />
        <Route path="/items/:id/edit" element={<EditItem />} />

        <Route path="/spells" element={<Spells/>}/>
        <Route path="/spells/create" element={<CreateSpell/>}/>
        <Route path="/spells/:id" element={<SpellDetailsPage />} />
        <Route path="/spells/edit/:id" element={<EditSpell />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
      </Routes>
    </div>
  );
}

export default App;

