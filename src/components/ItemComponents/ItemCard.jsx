import '../../ItemCard.css'
import { Link } from 'react-router-dom';
import '../../List.css'

function ItemCard({ item }) {
    return (
        <div className="card">
            <h3>
                <Link to={`/items/${item._id}`}>{item.name}</Link>
            </h3>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Rarity:</strong> {item.rarity}</p>
            {item.description && <p>{item.description}</p>}
        </div>
    );
}

export default ItemCard;
