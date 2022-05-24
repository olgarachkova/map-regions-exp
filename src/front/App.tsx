import './App.scss';

import React, { useState, useEffect } from 'react';
import { latlngToPx, IGeoSquare, IGeoSquareRaw, TScaleMode } from './func';

// import districts from '../mid/districts.json';
//import regions_nsk from '../mid/regions_nsk.json';
// import regions_russia from '../mid/regions.json';
import irtysh from '../mid/irtysh.json';
import GeoSquareObj from './GeoSquareObj';

import { BrowserRouter } from "react-router-dom";
import { Location, useLocation, useNavigate, NavigateFunction } from "react-router-dom";
import { Link } from "react-router-dom";
import { Routes, Route, useParams } from "react-router-dom";

const host = 'http://localhost:8341/'; // @@## !!!!

interface IAppProps {
    // regionId?: number,
    location: Location,
    navigate: NavigateFunction
}

function getBoundsFromElementsSquareHier(elementsSquareHier: IGeoSquareRaw[][]) {
    let res = {
        latMin: Infinity,
        latMax: -Infinity,
        lngMin: Infinity,
        lngMax: -Infinity
    };

    function workLayer(arr) {
        arr.forEach(item => {
            let lat = item[1];
            let lng = item[0];

            if (lat < res.latMin) {
                res.latMin = lat
            }

            if (lat > res.latMax) {
                res.latMax = lat
            }

            if (lng < res.lngMin) {
                res.lngMin = lng
            }

            if (lng > res.lngMax) {
                res.lngMax = lng
            }
        });
    }

    for (let i = 0; i < 1; i++) { // пока только с первого слоя
        let layer = elementsSquareHier[i]

        for (let j = 0; j < layer.length; j++) { // 
            let obj = layer[j]
            let coords = JSON.parse(obj.coords);
            if (obj.type === 'Polygon') {
                workLayer(coords[0])
            } else {
                coords.forEach((partCoords) => {
                    workLayer(partCoords[0])
                });
            }
        }
    }

    return res;
}

function getGeoObjectType(scaleMode: TScaleMode, i: number) {
    let res;
    
    if (scaleMode === 'country') {
        if (i === 0) {
            res = 'country'
        } else { // = 1
            res = 'region'
        }
    } else {
        if (i === 0) {
            res = 'region'
        } else { // = 1
            res = 'district'
        }
    }

    return res
}

function getCSSClassNameFromIndex(scaleMode: TScaleMode, i: number) {
    let res = getGeoObjectType(scaleMode, i)
    return res
}

const withRouter = (WrapperComponent: React.ComponentClass<{ location: Location, navigate: NavigateFunction }>) => () => {
    const location = useLocation();
    const navigate = useNavigate();
    return <WrapperComponent location={location} navigate={navigate} />;
};

export function SrcApp(props: IAppProps) {
    // let regionId = props.regionId;
    console.log(41432);

    const params = useParams();
    let regionId = params.id;

    let handleNavChange = (e: any) => {
        props.navigate(e.target.value)
    }

    const [elementsSquareHier, setElementsSqaureHier] = useState<IGeoSquareRaw[][]>([null, null]);
    // let [river, setRiver] = useState<number>(0);
    const [info, setInfo] = useState('');
    const [scaleMode, setScaleMode] = useState<TScaleMode>(regionId ? 'region' : 'country');
    const [selectedDistricts, setSelectedDistricts] = useState([]);

    function fillData(urlArr: string[]) {
        urlArr.forEach((url, i) => {
            fetch(url).then(resp => {
                resp.json().then(json => {
                    setElementsSqaureHier((oldElementsSquareHier) => {
                        let newElementsSquareHier = [...oldElementsSquareHier];
                        newElementsSquareHier[i] = Array.isArray(json) ? json : [json];
                        return newElementsSquareHier;
                    })
                });
            });
        })
    }

    useEffect(() => {
        // РАБОТА С СЕРВЕРОМ
        let urls;
        if (regionId) {
            urls = [host + 'region/' + regionId, host + 'districts/' + regionId];
        } else {
            urls = [host + 'country/192', host + 'regions'];
        }

        fillData(urls);

        // setDistrictsForRegion(districts);
        // setRegions(Object.values(regions_russia));

        // setRiver(...irtysh);
    }, [regionId]);

    // let [bbLatMin, bbLatMax, bbLngMin, bbLngMax] = [41, 82.1, 19, 180]; // Russia

    const width = 1500;
    const height = 800;
    //let height = Math.round(width * latSpan / lngSpan / Math.cos(Math.PI / 180 * bbLatMin));
    let pixelDims = { width, height };

    const handleClick = (e: React.SyntheticEvent<EventTarget>): void => {
        if (e.target.classList.contains('district')) {
            if (e.ctrlKey) {
                e.target.classList.add('district-select');
                setSelectedDistricts([...selectedDistricts, e.target]);
            } else {
                selectedDistricts.forEach(element => {
                    element.classList.remove('district-select');
                });
                e.target.classList.add('district-select');
                setSelectedDistricts([e.target]);
            }
        } else {
            selectedDistricts.forEach(element => {
                element.classList.remove('district-select');
            });
            setSelectedDistricts([]);
        }
    }

    let isReady = true;

    for (let i = 0; i < elementsSquareHier.length; i++) {
        isReady = elementsSquareHier[i] && isReady;
    }

    if (isReady) {
        let mapLatLngBounds = getBoundsFromElementsSquareHier(elementsSquareHier);

        let lngSpan = mapLatLngBounds.lngMax - mapLatLngBounds.lngMin;
        let latSpan = mapLatLngBounds.latMax - mapLatLngBounds.latMin;

        // let riverCoords;
        // if (typeof river.geojson.coordinates === 'string') {
        //     riverCoords = JSON.parse(river.geojson.coordinates);
        // } else {
        //     riverCoords = river.geojson.coordinates;
        // }

        handleNavChange = (e: any) => {
            debugger;
            props.navigate(e.target.value)
        }

        return (
            <>
                {/* <select
                    onChange={handleNavChange}
                >
                    <option value={10} key={10}>Новосибирск</option>
                    <option value={20} key={20}>Оренбург</option>
                </select> */}
                <div
                    className="App"
                    onClick={handleClick}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={width}
                        height={height}
                        className='svg'
                    >
                        <filter id='inset-shadow' data-iconmelon='filter:96c25f4e7a8a5b39d6df22c349dbaf39' >{/* @@## what is it? artifact?*/} 
                            <feOffset
                                dx='0'
                                dy='0'
                            />
                            <feGaussianBlur
                                stdDeviation='1'
                                result='offset-blur'
                            />
                            <feComposite
                                operator='out'
                                in='SourceGraphic'
                                in2='offset-blur'
                                result='inverse'
                            />
                            <feFlood
                                floodColor='black'
                                floodOpacity='.95'
                                result='color'
                            />
                            <feComposite
                                operator='in'
                                in='color'
                                in2='inverse'
                                result='shadow'
                            />
                            <feComposite
                                operator='over'
                                in='shadow'
                                in2='SourceGraphic'
                            />
                        </filter>

                        <filter id='emboss' x="-25%" y="-25%" width="150%" height="150%">
                            <feOffset in="SourceAlpha" dx="0.16666666666666666" dy="0.8333333333333334" result="17"></feOffset>
                            <feGaussianBlur stdDeviation="0.5" in="17" result="18"></feGaussianBlur>
                            <feSpecularLighting surfaceScale="1" specularConstant="0.9" specularExponent="15" in="18" result="19">
                                <fePointLight x="-1000" y="-5000" z="300"></fePointLight>
                            </feSpecularLighting>
                            <feComposite in="19" in2="SourceAlpha" operator="in" result="20"></feComposite>
                            <feOffset in="SourceAlpha" dx="-0.16666666666666666" dy="-0.8333333333333334" result="21"></feOffset>
                            <feGaussianBlur stdDeviation="0.5" in="21" result="22"></feGaussianBlur>
                            <feSpecularLighting surfaceScale="1" specularConstant="1.8" specularExponent="8" in="22" result="23">
                                <fePointLight x="100" y="5000" z="300"></fePointLight>
                            </feSpecularLighting>
                            <feComposite in="23" in2="SourceAlpha" operator="in" result="24"></feComposite>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .85 0" in="24" result="25"></feColorMatrix>
                            <feComposite k1="0" k2="0.8" k3="0.5" k4="0" in="20" in2="25" operator="arithmetic" result="26"></feComposite>
                            <feMerge in="26" result="27">
                                <feMergeNode in="SourceGraphic"></feMergeNode>
                                <feMergeNode in="26"></feMergeNode>
                            </feMerge>
                        </filter>
                        <filter id='blurry' x="-200%" y="-200%" width="400%" height="400%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                        </filter>

                        <filter id='color-shadow' colorInterpolationFilters="sRGB">
                            <feComponentTransfer in="SourceGraphic">
                                <feFuncR type="discrete" tableValues=".5" />
                                <feFuncG type="discrete" tableValues=".5" />
                                <feFuncB type="discrete" tableValues=".5" />
                            </feComponentTransfer>
                            <feGaussianBlur stdDeviation=".85" />
                            <feOffset dx="3" dy="3" result="shadow" />
                            <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                        </filter>

                        <filter id='color-shadow2' colorInterpolationFilters="sRGB">
                            <feOffset dx="1" dy="1" />
                            <feGaussianBlur stdDeviation=".85" />
                            <feColorMatrix type="matrix" values="0 0 0 0 .2, 1 0 0 0 1, 1 0 0 0 .75, 0 0 0 1 0" result="shadow" />
                            <feMerge>
                                <feMergeNode in="shadow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="f3" x="0" y="0" width="200%" height="200%">
                            <feOffset result="offOut" in="SourceAlpha" dx="10" dy="10" />
                            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
                            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                        </filter>
                        <filter id="shadow3">
                            <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="black" floodOpacity="0.5" />
                        </filter>

                        <text>Qwerty</text>

                        {elementsSquareHier.map((layer, i) => {
                            return layer.map((squareObj, j) => {
                                let coords;
                                if (typeof squareObj.coords === 'string') {
                                    coords = JSON.parse(squareObj.coords);
                                } else { // for tests // @@##
                                    coords = squareObj.coords;
                                }

                                if (!coords) { // @@## такого не должно быть при норм. базе
                                    return null;
                                }

                                let polygonPoints = [];

                                if (squareObj.type === 'Polygon') {
                                    let geoPoints = coords[0].map(item => {
                                        return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
                                    }).join(' ');

                                    polygonPoints.push(geoPoints);
                                } else {
                                    coords.forEach((crds) => {
                                        let geoPoints = crds[0].map(item => {
                                            return latlngToPx({ lat: item[1], lng: item[0] }, pixelDims, mapLatLngBounds);
                                        }).join(' ');

                                        polygonPoints.push(geoPoints);
                                    });
                                }

                                let cssClassName = getCSSClassNameFromIndex(scaleMode, i)
                                let objectType = getGeoObjectType(scaleMode, i)

                                // key={i+'-'+j}

                                // const geoInfo = geo[0].display_name;

                                return <GeoSquareObj
                                    objectType={objectType}
                                    coords={coords}
                                    type={squareObj.type}
                                    pixelDims={pixelDims}
                                    mapLatLngBounds={mapLatLngBounds}
                                    cssClassName={cssClassName}
                                    handleClick={() => {
                                        console.log('++++squareObj.type');
                                        console.log(squareObj.type);
                                        console.log(i);
        
                                        if (scaleMode === 'country' && objectType === 'region') {
                                            props.navigate('' + squareObj.regionId) // string in need 
                                        }
                                    }}
                                />
                            })
                        })}
                        {/* <polygon
                        points={riverPolygonPoints}
                        className='river'
                    /> */}
                    </svg>
                </div>
            </>
        );

    } else {
        return <div>Ждёмс...</div>;
    }
}

const PreApp = withRouter(SrcApp);

// function Exp() {
//     return (
//       <div>{54223}</div>
//     );
// }

// function ExpCh() {
//     return (
//       <div>{useParams().id}</div>
//     );
// }

export default function App() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<PreApp />} />
            <Route path="/" element={<PreApp />}>
                <Route path=":id" element={<PreApp />} />
            </Route>
        </Routes>
    </BrowserRouter>
}