import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getItemById, deleteItem } from '../../services/item.service';
import ItemDetails from '../../components/ItemComponents/ItemDetails';
import { toast } from 'react-hot-toast';

function ItemDetailsPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getItemById(id)
            .then((res) => setItem(res.data))
            .catch((err) => {
                console.error('Failed to fetch item:', err);
                setError('Item not found.');
            });
    }, [id]);

    const handleDelete = () => {
        const confirmed = window.confirm(`Are you sure you want to delete "${item.name}"?`);
        if (!confirmed) return;

        deleteItem(item._id)
            .then(() => {
                navigate('/items')
                toast.success('Deleted Item')
            })
            .catch((err) => {
                console.error('Failed to delete item:', err);
                toast.error('Failed to delete item. Please try again.');
            });
    };

    if (error) return <p className="error">{error}</p>;
    if (!item) return <p>Loading item...</p>;

    return (
        <>
            <ItemDetails item={item} />
            <button onClick={handleDelete} className="delete-button">Delete</button>
            <Link to={`/items/${item._id}/edit`} className="edit-button">
                Edit
            </Link>
            <Link to="/items">Back</Link>
        </>
    )
}

export default ItemDetailsPage;
