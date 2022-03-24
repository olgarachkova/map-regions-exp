import React from 'react';

import { getDistanceFromLatLngInKm, IDistrict, latlngToPx } from './func';

export function District(props) {
    let { coords, lineType, mapLatLngBounds, pixelDims, cssClassName } = props;

    let geoPoints;

    let polygonPoints = [];

    if (lineType === 'Polygon') {
        let coordsTest = coords[0];

        let coordsTestCutted = [coordsTest[0]];
        for (let i = 1; i < coordsTest.length; i++) {
            console.log(coordsTest[i])

            if (getDistanceFromLatLngInKm({ lat: coordsTest[i][1], lng: coordsTest[i][0] }, { lat: coordsTestCutted[coordsTestCutted.length - 1][1], lng: coordsTestCutted[coordsTestCutted.length - 1][0] }) > 10) {
                coordsTestCutted.push(coordsTest[i]);
            }
        }


        geoPoints = coordsTestCutted.map(item => {
            return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
        }).join(' ');

        polygonPoints.push(geoPoints);
    } else {

        coords.forEach((crds) => {

            let coordsTest = crds[0];
            let coordsTestCutted = [coordsTest[0]];
            for (let i = 1; i < coordsTest.length; i++) {
                if (getDistanceFromLatLngInKm({ lat: coordsTest[i][1], lng: coordsTest[i][0] }, { lat: coordsTestCutted[coordsTestCutted.length - 1][1], lng: coordsTestCutted[coordsTestCutted.length - 1][0] }) > 10) {

                    coordsTestCutted.push(coordsTest[i]);
                }
            }

            //console.log(coordsTestCutted);

            geoPoints = coordsTestCutted.map(item => {
                return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
            }).join(' ');
            //console.log(geoPoints);
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