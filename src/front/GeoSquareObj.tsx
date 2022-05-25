import React from 'react';

import { IGeoSquareToShow, latlngToPx } from './func';

export default function GeoSquareObj(props: IGeoSquareToShow) {
    let { coords, type, mapLatLngBounds, pixelDims, cssClassName } = props;

    let geoPoints;

    let polygonPoints = [];

    if (type === 'Polygon') {
        geoPoints = coords[0].map(item => {
            return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
        }).join(' ');

        polygonPoints.push(geoPoints);
    } else {
        coords.forEach((crds) => { // @@## names
            geoPoints = crds[0].map(item => {
                return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
            }).join(' ');

            polygonPoints.push(geoPoints);
        });
    }

    return <g>
        {polygonPoints.map((points, i) =>
            <polygon
                key={i}
                points={points}
                onClick={props.handleClick}
                className={cssClassName}
            >
                {/* <title>{geoInfo}</title> */}
            </polygon>)}
    </g>
}