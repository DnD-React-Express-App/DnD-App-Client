import { useState, useEffect } from 'react';
import ArmorFormFields from './ArmourFormFields';
import WeaponFormFields from './WeaponFormFields';
import { useContext } from 'react';
import { ItemContext } from '../../context/item.context';

function ItemForm({ initialData = {}, onSubmit }) {
    const { addItem } = useContext(ItemContext);
    const blankItem = {
        name: '',
        description: '',
        rarity: 'Common',
        type: 'Weapon',
        armorType: '',
        weight: '',
        weaponProperties: [],
        damageTypes: [],
    };


    const [formData, setFormData] = useState(blankItem);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (initialData && initialData.name) {
            const normalizedDamageTypes = (initialData.damageTypes || []).map(d => {
                const match = d.die.match(/^(\d+)d(\d+)$/);
                return {
                    dieAmount: match ? Number(match[1]) : 1,
                    dieType: match ? `d${match[2]}` : 'd6',
                    damageType: d.type || '',
                };
            });

            setFormData({
                ...blankItem,
                ...initialData,
                damageTypes: normalizedDamageTypes,
                weaponProperties: initialData.weaponProperties || [],
            });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        let dataToSubmit = {
          ...formData,
          weight: formData.weight ? Number(formData.weight) : undefined,
        };
      
        if (formData.type === 'Weapon' && formData.damageTypes?.length) {
          dataToSubmit = {
            ...dataToSubmit,
            damageTypes: formData.damageTypes.map(d => ({
              type: d.damageType,
              die: `${d.dieAmount}${d.dieType}`,
            })),
          };
        }
      
        try {
          await onSubmit(dataToSubmit);
          toast.success('Item created!');
        } catch (err) {
          console.error('Save failed:', err);
          const msg = err.response?.data?.message || err.message || 'Item save failed.';
          setErrorMessage(msg);
          toast.error(msg);
        }
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
                <WeaponFormFields
                    formData={formData}
                    handleChange={handleChange}
                    setFormData={setFormData}
                />
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
