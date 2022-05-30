import React from 'react';

import { IGeoSquareToShow, latlngToPx, cutPoints } from './func';

export default function GeoSquareObj(props: IGeoSquareToShow) {
    let {
        objectType,
        scaleMode,
        setScaleMode,
        coords,
        type,
        mapLatLngBounds,
        pixelDims,
        bbLatMin,
        bbLatMax,
        bbLngMin,
        bbLngMax,
        cssClassName,
        setScale,
        setTranslateX,
        setTranslateY,
        handleClick,
    } = props;

    let geoPoints;

    let polygonPoints = [];

    let diffKm = 0;
    if (scaleMode === 'country') {
        diffKm = 10;
    } else {
        diffKm = 0.1;
    }

    if (type === 'Polygon') {
        coords.forEach((crd) => {
            let coordsCutted = cutPoints(crd, diffKm);
            geoPoints = coordsCutted.map(item => {
                return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
            }).join(' ');
            polygonPoints.push(geoPoints);
        })
    } else {
        coords.forEach((crds) => {
            crds.forEach(crd => {
                let coordsTestCutted = cutPoints(crd, diffKm);
                geoPoints = coordsTestCutted.map(item => {
                    return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
                }).join(' ');
                polygonPoints.push(geoPoints);
            });

        });
    }

    const handleGeoClick = (e) => {
        const min = latlngToPx({ lat: bbLatMin, lng: bbLngMin }, pixelDims, mapLatLngBounds);
        const max = latlngToPx({ lat: bbLatMax, lng: bbLngMax }, pixelDims, mapLatLngBounds);
        setScale((Math.min(pixelDims.width / Math.abs(max[0] - min[0]), pixelDims.height / Math.abs(max[1] - min[1]))));
        setTranslateX(pixelDims.width / 2 - (max[0] + min[0]) / 2);
        setTranslateY(pixelDims.height / 2 - (max[1] + min[1]) / 2);

        handleClick();//nav to region

        setScaleMode('region');
        setScale(1);
        setTranslateX(0);
        setTranslateY(0);
    }

    return <g
        onClick={handleGeoClick}
    >
        {polygonPoints.map((points, i) =>
            <polygon
                key={i}
                points={points}
                //onClick={props.handleClick}
                className={cssClassName}
            >
                {/* <title>{geoInfo}</title> */}
            </polygon>)}
    </g>
}