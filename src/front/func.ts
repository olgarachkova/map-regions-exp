export type TPointArr = [number, number]
export type TPointObj = {
    lat: number,
    lng: number
}

interface IPolyline extends Array<TPointArr[]> {

}

interface IMultiPolyline extends Array<IPolyline[]> {

}

// interface IViewboxObj {
//     top: number,
//     right: number, 
//     bottom: number, 
//     left: number
// }

export interface IBBox {
    latMin: number,
    latMax: number,
    lngMin: number,
    lngMax: number
}

export interface IDistrict {
    coords: IPolyline | IMultiPolyline,
    lineType: 'Polygon' | 'MultiPolygon'
    pixelDims: {
        width: number,
        height: number
    },
    mapLatLngBounds: IBBox,
    setInfo: any,
    cssClassName: string
}

export function latlngToPx(
    point: TPointObj,
    pixelDims: {
        width: number,
        height: number
    },
    latLngBounds: IBBox,
) {
    let coefX = pixelDims.width / (latLngBounds.lngMax - latLngBounds.lngMin);
    const coefY = pixelDims.height / (latLngBounds.latMax - latLngBounds.latMin);
    const viewboxCurrentX = (point.lng - latLngBounds.lngMin) * coefX;
    const viewboxCurrentY = (point.lat - latLngBounds.latMin) * coefY;
    return [viewboxCurrentX, pixelDims.height - viewboxCurrentY];
}

function degToRadian(deg) {
    return deg * (Math.PI / 180)
}

export function getDistanceFromLatLngInKm(point1: TPointObj, point2: TPointObj) {
    const earthRadius = 6371;
    let dfLat = degToRadian(point2.lat - point1.lat);
    let dfLng = degToRadian(point2.lng - point1.lng);
    let a =
        Math.sin(dfLat / 2) * Math.sin(dfLat / 2) +
        Math.cos(degToRadian(point1.lat)) * Math.cos(degToRadian(point2.lat)) *
        Math.sin(dfLng / 2) * Math.sin(dfLng / 2)
        ;
    let distance = earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return distance;
}


