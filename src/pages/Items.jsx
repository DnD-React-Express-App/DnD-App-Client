import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { getItems } from '../services/item.service';
import ItemList from '../components/ItemList';
import { Link } from 'react-router-dom';

function Items() {
    const { isLoggedIn, user, isLoading } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [error, setError] = useState('');

    useEffect(() => {
        getItems()
            .then(res => setItems(res.data))
            .catch(err => {
                console.error('Failed to fetch items:', err);
                setError('Failed to load items.');
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleTypeFilter = (type) => {
        setTypeFilter(type);
    };

    const filteredItems = items.filter(item => {
        const matchesType = typeFilter === 'All' || item.type === typeFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    if (isLoading) return <p>Loading...</p>;
    if (!isLoggedIn) return <p>You must be logged in to view characters.</p>;

    return (
        <div className="login-page">
            <h2>All Items</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                <div className="type-tabs">
                    {['All', 'Armor', 'Weapon', 'Potion', 'Tool', 'Misc'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeFilter(type)}
                            className={typeFilter === type ? 'active' : ''}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {errorMessage && <p className="error">{errorMessage}</p>}
            <ItemList items={filteredItems} />
            <Link to="/items/create">Create a New Item</Link>
        </div>
    );
}

export default Items;