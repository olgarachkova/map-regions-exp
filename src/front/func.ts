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

/*export interface IDistrict {
    coords: IPolyline | IMultiPolyline,
    lineType: 'Polygon' | 'MultiPolygon'
}*/

export type TScaleMode = 'country' | 'region';

export interface ICoordsBaseRaw {
    coords: string
}

export interface ICoordsBase {
    coords: IPolyline | IMultiPolyline
}

export interface ICoordsSecondary {
    type: 'Polygon' | 'MultiPolygon',
    mapLatLngBounds?: IBBox
}

export interface IGeoSquare extends ICoordsBase, ICoordsSecondary {

}

export interface IGeoSquareRaw extends ICoordsBaseRaw, ICoordsSecondary {

}

export interface IGeoSquareToShow extends IGeoSquare {
    objectType: 'country' | 'region' | 'district',
    scaleMode?: TScaleMode;
    setScaleMode: any;
    pixelDims: {
        width: number,
        height: number
    },
    bbLatMin: number,
    bbLatMax: number,
    bbLngMin: number,
    bbLngMax: number,
    mapLatLngBounds: IBBox,
    handleClick: any,
    cssClassName: string,
    setScale: any,
    setTranslateX: any,
    setTranslateY: any,
}

interface IBaseDistrict {
    pixelDims: {
        width: number,
        height: number
    },
    mapLatLngBounds: IBBox,
    setInfo: any,
    cssClassName: string,
    bbLatMin: number,
    bbLatMax: number,
    bbLngMin: number,
    bbLngMax: number,
    style?: object,
    setScale?: any,
    setTranslateY?: any,
    setTranslateX?: any,
    setDistrictOpacity?: any,
    regionName?: string,
}

interface IPolygonDistrict {
    lineType: 'Polygon'
    coords: IPolyline
}

interface IMultiPolygonDistrict {
    lineType: 'MultiPolygon'
    coords: IMultiPolyline
}

export type IDistrict = IBaseDistrict & (IPolygonDistrict | IMultiPolygonDistrict);

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


export function cutPoints(coords: Array<TPointArr>, diffKm: number) {
    let coordsCutted = [coords[0]];
    for (let i = 1; i < coords.length; i++) {

        if (getDistanceFromLatLngInKm(
            {
                lat: coords[i][1],
                lng: coords[i][0]
            },
            {
                lat: coordsCutted[coordsCutted.length - 1][1],
                lng: coordsCutted[coordsCutted.length - 1][0]
            }
        ) > diffKm) {
            coordsCutted.push(coords[i]);
        }
    }
    return coordsCutted;
}