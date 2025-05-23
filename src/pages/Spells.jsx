import React from "react";
import SpellList from "../components/SpellList";
import { Link } from 'react-router-dom';

const Spells = () => {
  return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Spell List</h1>
        <Link to="/spells/create">Add a Spell</Link>
        <SpellList />
      </div>
  );
};

export default Spells;
