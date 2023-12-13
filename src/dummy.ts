import { GeoData, GeoDataType } from "./interface/geo";

export let dummyData: GeoData = [
    {
        type: GeoDataType.RESIDENTIAL,
        boundaryPoints: [{
            x: 0.5,
            y: 0.5,
        }],
        centralPoint: {
            x: 0.5,
            y: 0.5,
        },
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
    },
    {
        type: GeoDataType.RESIDENTIAL,
        boundaryPoints: [{
            x: 1,
            y: 1,
        }],
        centralPoint: {
            x: 1,
            y: 1,
        },
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
    },
    {
        type: GeoDataType.RESIDENTIAL,
        boundaryPoints: [{
            x: 2,
            y: 2,
        }],
        centralPoint: {
            x: 2,
            y: 2,
        },
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
    }
]