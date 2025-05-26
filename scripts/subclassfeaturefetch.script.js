import fetch from 'node-fetch';
import fs from 'fs';

async function fetchSubclassFeatures() {
  const subclassesUrl = 'https://www.dnd5eapi.co/api/subclasses';
  const subclassFeatures = {};

  const subclassesRes = await fetch(subclassesUrl);
  if (!subclassesRes.ok) {
    console.error('Failed to fetch subclass list');
    return;
  }
  const subclassesData = await subclassesRes.json();

  const subclasses = subclassesData.results || subclassesData;

  console.log(`Found ${subclasses.length} subclasses`);

  for (const subclass of subclasses) {
    console.log(`Fetching subclass: ${subclass.name}`);

    const detailRes = await fetch(`https://www.dnd5eapi.co${subclass.url}`);
    if (!detailRes.ok) {
      console.warn(`⚠️ Failed to fetch details for ${subclass.name}`);
      continue;
    }
    const detailData = await detailRes.json();

    subclassFeatures[subclass.name] = {
      class: detailData.class?.name || 'Unknown',
      subclass_flavor: detailData.subclass_flavor || '',
      description: Array.isArray(detailData.desc) ? detailData.desc.join(' ') : String(detailData.desc),
      features: []
    };

    if (detailData.subclass_levels) {
      const levelsRes = await fetch(`https://www.dnd5eapi.co${detailData.subclass_levels}`);
      if (!levelsRes.ok) {
        console.warn(`⚠️ Failed to fetch subclass levels for ${subclass.name}`);
        continue;
      }
      const levelsData = await levelsRes.json();

      for (const levelEntry of levelsData) {
        const level = levelEntry.level;

        if (levelEntry.features) {
          for (const featureRef of levelEntry.features) {

            const featureRes = await fetch(`https://www.dnd5eapi.co${featureRef.url}`);
            if (!featureRes.ok) {
              console.warn(`⚠️ Failed to fetch feature ${featureRef.url}`);
              continue;
            }
            const featureData = await featureRes.json();

            subclassFeatures[subclass.name].features.push({
              name: featureData.name,
              description: Array.isArray(featureData.desc) ? featureData.desc.join(' ') : String(featureData.desc),
              level: level
            });
          }
        }
      }
    } else {
      console.log(`No subclass_levels endpoint for ${subclass.name}, skipping features.`);
    }
  }

  fs.writeFileSync('subclass_features.json', JSON.stringify(subclassFeatures, null, 2));
  console.log('✅ Subclass features saved to subclass_features.json');
}

fetchSubclassFeatures().catch(console.error);