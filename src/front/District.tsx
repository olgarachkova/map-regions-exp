import React from 'react';

import { IDistrict, latlngToPx } from './func';

export function District(props: IDistrict) {
    let { coords, lineType, mapLatLngBounds, pixelDims, cssClassName } = props;

    let geoPoints;

    let polygonPoints = [];

    if (lineType === 'Polygon') {
        geoPoints = coords[0].map(item => {
            return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
        }).join(' ');

        polygonPoints.push(geoPoints);
    } else {
        coords.forEach((crds) => {
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

    return (
        <g>
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
    );
}

export default District;