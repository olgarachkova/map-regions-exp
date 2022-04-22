import React from 'react';

import { cutPoints, IDistrict, latlngToPx, TPointArr } from './func';

export function District(props: IDistrict) {
    let { regionName, coords, lineType, mapLatLngBounds, pixelDims, cssClassName, bbLatMin, bbLatMax, bbLngMin, bbLngMax, style = {}, setInfo, setHoverInfo, setScale, setTranslateY, setTranslateX, setDistrictOpacity } = props;

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

    const handleClick = (e) => {
        setInfo(regionName);
    }

    const handleHover = () => {
        setHoverInfo(regionName);
    }

    return (
        <g
            className={cssClassName}
            onClick={handleClick}
            onMouseOver={handleHover}
        >
            {polygonPoints.map((points, i) =>
                <polygon
                    key={i}
                    points={points}
                    style={style}
                >
                </polygon>)}
        </g>
    );
}

export default District;