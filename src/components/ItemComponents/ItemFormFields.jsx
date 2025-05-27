import { useState, useEffect } from 'react';
import ArmorFormFields from './ArmourFormFields';
import WeaponFormFields from './WeaponFormFields';

function ItemForm({ initialData = {}, onSubmit }) {
    const blankItem = {
        name: '',
        description: '',
        rarity: 'Common',
        type: 'Weapon',
        armorType: '',
        weight: '',
    };

    const [formData, setFormData] = useState(blankItem);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (initialData && initialData.name) {
            setFormData({ ...blankItem, ...initialData });
        } else {
            setFormData(blankItem);
        }
    }, [initialData?._id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'type') {
            setFormData(prev => ({
                ...prev,
                type: value,
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            weight: formData.weight ? Number(formData.weight) : undefined,
        };

        onSubmit(dataToSubmit).catch((err) => {
            const msg = err.response?.data?.error || 'Item save failed.';
            setErrorMessage(msg);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Item Type:</label>
            <select name="type" value={formData.type} onChange={handleChange}>
                <option>Weapon</option>
                <option>Armor</option>
            </select>

            <label>{formData.type} Name:</label>
            <input name="name" value={formData.name} onChange={handleChange} />

            {formData.type === 'Armor' && (
                <ArmorFormFields formData={formData} handleChange={handleChange} />
            )}

            {formData.type === 'Weapon' && (
                <WeaponFormFields formData={formData} handleChange={handleChange} />
            )}

            <label>Description:</label>
            <input name="description" value={formData.description} onChange={handleChange} />

            <label>Rarity:</label>
            <select name="rarity" value={formData.rarity} onChange={handleChange}>
                <option>Common</option>
                <option>Uncommon</option>
                <option>Rare</option>
                <option>Very Rare</option>
                <option>Legendary</option>
                <option>Artifact</option>
            </select>

            <label>Weight:</label>
            <input
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
            />

            <button type="submit">Save Item</button>

            {errorMessage && <p className="error">{errorMessage}</p>}
        </form>
    );
}

export default ItemForm;
