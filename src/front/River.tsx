import React from 'react';

import { latlngToPx } from './func';

export function River(props) {
    const { river, mapLatLngBounds, pixelDims } = props;

    let riverPolygonPoints = [];

    //console.log(riverName, riverCoords);


    river.forEach(riverpart => {
        let riverCoords;
        if (typeof riverpart.geojson.coordinates === 'string' && riverpart.type === 'river') {
            riverCoords = JSON.parse(riverpart.geojson.coordinates);
        } else {
            riverCoords = riverpart.geojson.coordinates;
        }
        if (river.lineType === 'LineString') {
            riverCoords.forEach(crd => {
                let riverGeoPoints = latlngToPx({ lat: crd[1], lng: crd[0] }, pixelDims, mapLatLngBounds).join(' ');
                riverPolygonPoints.push(riverGeoPoints);
            });
        } else {
            riverCoords.forEach((crds) => {
                if (Array.isArray(crds)) {
                    let riverGeoPoints = crds.map(item => {
                        return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
                    }).join(' ');

                    riverPolygonPoints.push(riverGeoPoints);
                }
            });
        }
    });


    return (
        <g>
            {riverPolygonPoints.map((points, idx) =>
                <polyline
                    points={points}
                    key={'river' + idx}
                    className='river'
                />
            )}
        </g>
    );
}

export default River;