import React from 'react';

import { IGeoSquareToShow, latlngToPx } from './func';

export default function GeoSquareObj(props: IGeoSquareToShow) {
    console.log(13718182);
    // debugger;

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

    // const geoInfo = geo[0].display_name;

    const handleClick = (e) => {
        // setInfo(geoInfo);
    }

    return <g>
        {polygonPoints.map((points, i) =>
            <polygon
                key={i}
                points={points}
                onClick={handleClick}
                className={cssClassName}
            >
                {/* <title>{geoInfo}</title> */}
            </polygon>)}
    </g>
}