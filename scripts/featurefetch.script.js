import fetch from 'node-fetch';
import fs from 'fs';

const classes = [
  'barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk',
  'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard',
  'artificer' // Include if your app supports Artificer
];

const classFeatures = {};

for (const className of classes) {
  const displayName = className.charAt(0).toUpperCase() + className.slice(1);
  classFeatures[displayName] = { features: [] };

  for (let level = 1; level <= 20; level++) {
    const res = await fetch(`https://www.dnd5eapi.co/api/classes/${className}/levels/${level}`);
    if (!res.ok) {
      console.warn(`⚠️ Failed to fetch ${className} level ${level}`);
      continue;
    }
    const levelData = await res.json();

    if (levelData.features) {
      for (const feature of levelData.features) {
        const featureRes = await fetch(`https://www.dnd5eapi.co${feature.url}`);
        if (!featureRes.ok) {
          console.warn(`⚠️ Failed to fetch feature: ${feature.url}`);
          continue;
        }
        const featureData = await featureRes.json();

        classFeatures[displayName].features.push({
          name: featureData.name,
          description: Array.isArray(featureData.desc)
            ? featureData.desc.join(' ')
            : String(featureData.desc),
          level: level
        });
      }
    }
  }
}

fs.writeFileSync('class_features.json', JSON.stringify(classFeatures, null, 2));
console.log('✅ Class features saved to class_features.json');