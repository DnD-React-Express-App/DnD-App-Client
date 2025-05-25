import ItemCard from './ItemCard';

function ItemList({ items }) {
  if (!items.length) return <p>No items found.</p>;

  return (
    <div className="item-list">
      {items.map(item => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}

export default ItemList;
