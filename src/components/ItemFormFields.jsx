import { useState } from 'react';
import ArmorFormFields from './ArmourFormFields';
import WeaponFormFields from './WeaponFormFields';



function ItemForm({ initialData = {}, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        rarity: 'Common',
        type: 'Weapon',
        armorName: '',
        armorType: '',
        weight: '',
        ...initialData,
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            name:
                formData.type === 'Armor'
                    ? formData.armorName
                    : formData.type === 'Weapon'
                        ? formData.weaponName
                        : formData.name,
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

            <button type="submit">Save Item</button>

            {errorMessage && <p className="error">{errorMessage}</p>}
        </form>
    );
}

export default ItemForm;
