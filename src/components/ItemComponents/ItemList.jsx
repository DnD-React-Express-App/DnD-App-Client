import ItemCard from './ItemCard';
import '../../List.css'

function ItemList({ items }) {
  if (!items.length) return <p>No items found.</p>;

  return (
    <div className="list">
      {items.map(item => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}

export default ItemList;
