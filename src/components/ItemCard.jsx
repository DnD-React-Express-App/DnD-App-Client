import '../ItemCard.css'

function ItemCard({ item }) {
    return (
      <div className="item-card">
        <h3>{item.name}</h3>
        <p><strong>Type:</strong> {item.type}</p>
        <p><strong>Rarity:</strong> {item.rarity}</p>
        {item.description && <p>{item.description}</p>}
      </div>
    );
  }
  
  export default ItemCard;
  