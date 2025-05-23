import React, { useContext } from "react";
import { SpellContext } from "../context/spell.context";
import SpellCard from "./SpellCard";

const SpellList = () => {
  const { spells, loading } = useContext(SpellContext);

  if (loading) return <p>Loading spells...</p>;

  return (
    <div>
      {spells.map((spell) => (
        <SpellCard key={spell._id} spell={spell} />
      ))}
    </div>
  );
};

export default SpellList;
