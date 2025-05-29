import React from "react";
import { Link } from "react-router-dom";
import "../Home.css";

function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h2>Welcome to</h2>
        <h1>Quill and Scroll</h1>
        <p>Craft your heroes, forge legendary items, and design ultimate spells.</p>
      </div>

      <div className="list">
        <div className="card">
          <h3>Characters</h3>
          <p>View all your created characters.</p>
          <div className="actions">
            <Link to="/characters">
              <button>View Characters</button>
            </Link>
            <Link to="/create-character">
              <button>Create New</button>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>Spells</h3>
          <p>Explore magical spells or create your own custom magic.</p>
          <div className="actions">
            <Link to="/spells">
              <button>Browse Spells</button>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3>Items</h3>
          <p>Browse magical gear or design your own artifacts.</p>
          <div className="actions">
            <Link to="/items">
              <button>Browse Items</button>
            </Link>
            <Link to="/items/create">
              <button>Create Item</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="home-flavor">
        <blockquote>
          “In the heart of every hero, a story waits to be told.”
        </blockquote>
      </div>
    </div>
  );
}

export default Home;