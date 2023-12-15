import fs from 'fs';
import { Vector3 } from "three";

function extractFeatureData(geojsonData) {
    const featuresList = [];

    const featuresArray = Array.isArray(geojsonData.features)
        ? geojsonData.features
        : [geojsonData.features];


    for (const feature of geojsonData.features) {
        const properties = feature.properties;
        const coordinates = feature.geometry.coordinates[0];

        const centerCoordinate = coordinates.reduce(
            (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
            [0, 0]
        );
        centerCoordinate[0] /= coordinates.length;
        centerCoordinate[1] /= coordinates.length;

        const featureDict = {
            key: properties.OBJECTID,
            type: "GeoDataType.RESIDENTIAL",
            floors: properties.No_Floors,
            boundaryPoints: "[new Vector3(0, 0, 0)]",
            centralPoint: "new Vector3(" + centerCoordinate[0] + ", 0, " + centerCoordinate[1] + ")",
            metadata: {
              roadDistance: 0,
              residentialDistance: 0,
              hospitalDistance: 0,
              agriculturalDistance: 0,
              commercialDistance: 0,
              industrialDistance: 0,
              schoolDistance: 0,
              healthDistance: 0,
              sewageTreatmentDistance: 0,
              waterBodyDistance: 0,
            },
          };

        featuresList.push(featureDict);
    }

    return featuresList;
}

const geojsonData = JSON.parse(fs.readFileSync('src/geojson/Builtup_Kalonda.geojson', 'utf8'));
console.log(geojsonData.features[0])

const featuresList = extractFeatureData(geojsonData);

fs.writeFileSync('output.js', `const featuresList = ${JSON.stringify(featuresList, null, 2)};\n\nmodule.exports = featuresList;`, 'utf-8');

console.log('Data written to output.js');