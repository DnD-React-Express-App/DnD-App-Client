import React from 'react';

const ClassTab = ({
    form,
    classOptions,
    classFeatures,
    allSubclassFeatures,
    handleClassChange,
    handleSubclassChange,
    removeClass,
    addClass,
}) => {
    return (
        <div>
            {form.classes.map((cls, index) => {
                const className = cls.name;
                const classLevel = cls.level;
                const subclassName = cls.subclass || '';

                console.log(subclassName)
                const selectedSubclass = subclassName
                    ? allSubclassFeatures?.[className]?.[subclassName] ?? null
                    : null;

                const unlocked = classFeatures[index]?.unlocked || [];

                console.log(allSubclassFeatures)

                const subclassUnlocked =
                    selectedSubclass?.features?.filter((feat) => feat.level <= classLevel) || [];

                const subclassOptions = className && allSubclassFeatures?.[className]
                    ? Object.keys(allSubclassFeatures[className])
                    : [];

                return (
                    <div key={index}>
                        <select
                            value={className}
                            onChange={(e) => handleClassChange(index, 'name', e.target.value)}
                        >
                            <option value="">Select Class</option>
                            {classOptions.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={classLevel}
                            onChange={(e) =>
                                handleClassChange(index, 'level', parseInt(e.target.value) || 1)
                            }
                            placeholder="Class Level"
                        />

                        {subclassOptions.length > 0 ? (
                            <select
                                value={subclassName}
                                onChange={(e) => handleSubclassChange(index, e.target.value)}
                            >
                                <option value="">Select Subclass</option>
                                {subclassOptions.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub} ({allSubclassFeatures[className][sub].subclass_flavor})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            className && <p>No subclass options for {className}</p>
                        )}

                        {form.classes.length > 1 && (
                            <button type="button" onClick={() => removeClass(index)}>
                                Remove
                            </button>
                        )}

                        {unlocked.length > 0 && (
                            <div>
                                <h4>Unlocked Class Features:</h4>
                                <ul>
                                    {unlocked.map((feature) => (
                                        <li key={feature.name}>
                                            <strong>{feature.name}</strong> (Level {feature.level}):{' '}
                                            {feature.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {subclassUnlocked.length > 0 && (
                            <div>
                                <h4>Unlocked Subclass Features:</h4>
                                <ul>
                                    {subclassUnlocked.map((feature) => (
                                        <li key={feature.name}>
                                            <strong>{feature.name}</strong> (Level {feature.level}):{' '}
                                            {feature.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}

            <div>
                <button type="button" onClick={addClass}>
                    + Add Class
                </button>
            </div>
        </div>
    );
};

export default ClassTab;
