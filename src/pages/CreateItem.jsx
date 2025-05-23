import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/item.service';
import ItemForm from '../components/ItemFormFields';

function CreateItem() {
  const navigate = useNavigate();

  const handleCreate = (data) => {
    return createItem(data)
      .then(() =>
        navigate('/items')
      );
  };

  return (
    <div className="create-item-page">
      <h2>Create New Item</h2>
      <ItemForm onSubmit={handleCreate} />
    </div>
  );
}

export default CreateItem;
