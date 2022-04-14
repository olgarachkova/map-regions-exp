import React from 'react';

import { cutPoints, IDistrict, latlngToPx, TPointArr } from './func';

function Country(props) {
    let { coords, lineType, mapLatLngBounds, pixelDims, style = {} } = props;

    let geoPoints;

    let polygonPoints = [];

    if (lineType === 'Polygon') {
        coords.forEach((crd) => {
            let coordsCutted = cutPoints(crd as TPointArr[]);
            geoPoints = coordsCutted.map(item => {
                return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
            }).join(' ');
            polygonPoints.push(geoPoints);
        })
    } else {
        coords.forEach((crds) => {
            crds.forEach(crd => {
                let coordsTestCutted = cutPoints(crd);
                geoPoints = coordsTestCutted.map(item => {
                    return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
                }).join(' ');
                polygonPoints.push(geoPoints);
            });

        });
    }

    return (
        <>
            {polygonPoints.map((points, i) =>
                <polygon
                    key={i}
                    points={points}
                    className={'country'}
                    style={style}
                >
                    {/* <title>{geoInfo}</title> */}
                </polygon>)}
        </>
    );
}

export default Country;