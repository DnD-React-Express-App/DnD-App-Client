import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItem } from '../../services/item.service';
import ItemForm from '../../components/ItemComponents/ItemFormFields';

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getItemById(id)
      .then(res => setItem(res.data))
      .catch(err => {
        console.error('Error fetching item:', err);
        setError('Failed to load item.');
      });
  }, [id]);

  const handleUpdate = (formData) => {
    return updateItem(id, formData).then(() => {
      navigate(`/items/${id}`);
    });
  };

  if (error) return <p className="error">{error}</p>;
  if (!item) return <p>Loading item...</p>;

  return (
    <div className="edit-item-page">
      <h2>Edit Item</h2>
      <ItemForm initialData={item} onSubmit={handleUpdate} />
    </div>
  );
}

export default EditItem;
