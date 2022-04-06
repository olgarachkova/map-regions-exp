import React from 'react';

import { cutPoints, IDistrict, latlngToPx, TPointArr } from './func';

export function District(props: IDistrict) {
    let { regionName, coords, lineType, mapLatLngBounds, pixelDims, cssClassName, bbLatMin, bbLatMax, bbLngMin, bbLngMax, style = {}, setScale, setTranslateY, setTranslateX, setDistrictOpacity } = props;

    let geoPoints;

    let polygonPoints = [];

    let cartHeight = 507.373;
    let cartWidth = 1500;

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

    // const geoInfo = geo[0].display_name;

    const handleClick = (e) => {
        const min = latlngToPx({ lat: bbLatMin, lng: bbLngMin }, pixelDims, mapLatLngBounds);
        const max = latlngToPx({ lat: bbLatMax, lng: bbLngMax }, pixelDims, mapLatLngBounds);
        setScale((Math.min(cartWidth / Math.abs(max[0] - min[0]), cartHeight / Math.abs(max[1] - min[1]))) * 0.8);
        setTranslateX(cartWidth / 2 - (max[0] + min[0]) / 2);
        setTranslateY(cartHeight / 2 - (max[1] + min[1]) / 2);

        regionName === "Новосибирская область" ? setDistrictOpacity('black') : setDistrictOpacity('none');
    }

    return (
        <g
            className={cssClassName}
            onClick={handleClick}
        >
            {polygonPoints.map((points, i) =>
                <polygon
                    key={i}
                    points={points}

                    style={style}
                >
                    {/* <title>{geoInfo}</title> */}
                </polygon>)}
        </g>
    );
}

export default District;