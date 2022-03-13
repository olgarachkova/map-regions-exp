import './App.scss';

import React, { useState, useEffect } from 'react';
import District from './District';
import { latlngToPx } from './func';

import districts from '../mid/districts.json';
import regions from '../mid/regions_nsk.json';

interface IAppProps {
    regionId: number
}

export function App(props: IAppProps) {
    // console.log(Object.keys(dataBig).length);
    // console.log(regions);

    let regionId = props.regionId;

    let [districtsForRegion, setDistrictsForRegion] = useState(null);
    let [region, setRegion] = useState(null);
    const [info, setInfo] = useState('');
    const [selectedDistricts, setSelectedDistricts] = useState([]);

    useEffect(() => {
        // РАБОТА С СЕРВЕРОМ
        // let url = 'http://localhost:8340/districts/' + regionId;
        // fetch(url).then(resp => {
        //     resp.json().then(json => {
        //         let t = 1;
        //         setDistrictsForRegion(json);
        //     });
        // });

        // let url1 = 'http://localhost:8340/region/' + regionId;
        // fetch(url1).then(resp => {
        //     resp.json().then(json => {
        //         let t = 1;
        //         setRegion(json);
        //     });
        // });

        setDistrictsForRegion(districts);
        setRegion(Object.values(regions)[0]);
    }, [regionId]);

    if (districtsForRegion && region) {
        let { bbLatMin, bbLatMax, bbLngMin, bbLngMax } = region;

        const width = 1000;
        let lngSpan = bbLngMax - bbLngMin;
        let latSpan = bbLatMax - bbLatMin;
        let height = Math.round(width * latSpan / lngSpan / Math.cos(Math.PI / 180 * bbLatMin));
        let pixelDims = { width, height };

        let mapLatLngBounds = { latMin: bbLatMin, latMax: bbLatMax, lngMin: bbLngMin, lngMax: bbLngMax };

        let coords;
        if (typeof region.coords === 'string') {
            coords = JSON.parse(region.coords);
        } else { // for tests
            coords = region.coords;
        }

        let first = coords[0].map(point => point[0]);
        let second = coords[0].map(point => point[1]);

        let minLat = Math.min(...first);
        let maxLat = Math.max(...first);

        let minLng = Math.min(...second);
        let maxLng = Math.max(...second);

        /*console.log(minLat)
        console.log(maxLat)
        console.log(minLng)
        console.log(maxLng)*/

        let polygonPoints = [];

        if (region.objectType === 'Polygon') {
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

        let points = polygonPoints[0];

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

        return (
            <>
                <div
                    className="App"
                    onClick={handleClick}
                >
                    <svg
                        // viewBox={`0 0 ${width} ${height}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width={width}
                        height={height}
                        className='svg'

                    >
                        {/* Коллекция фильтров для теней. Копипаст с https://codepen.io/sol0mka/pen/kNOyzb/6eca814eda8ec7e758d0feab628bd390 */}
						<filter id='inset-shadow' data-iconmelon='filter:96c25f4e7a8a5b39d6df22c349dbaf39' >
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
                                flood-color='black'
                                flood-opacity='.95'
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

                        <filter id='color-shadow' color-interpolation-filters="sRGB">
                            <feComponentTransfer in="SourceGraphic">
                                <feFuncR type="discrete" tableValues=".5" />
                                <feFuncG type="discrete" tableValues=".5" />
                                <feFuncB type="discrete" tableValues=".5" />
                            </feComponentTransfer>
                            <feGaussianBlur stdDeviation=".85" />
                            <feOffset dx="3" dy="3" result="shadow" />
                            <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                        </filter>

                        <filter id='color-shadow2' color-interpolation-filters="sRGB">
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
                            <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="black" flood-opacity="0.5" />
                        </filter>
                        {/* <linearGradient id="gradlinear">
                            <stop offset="0%" stopColor="crimson"
                                className="stop-1" />
                            <stop offset="50%" stopColor="gold"
                                className="stop-2" />
                            <stop offset="100%" stopColor="teal"
                                className="stop-3" />
                        </linearGradient> */}
                        <polygon
                            points={points}
                            className='region'
                        >
                        </polygon>
                        {Object.keys(districtsForRegion).map((id) => {
                            let data = districtsForRegion[id];

                            if (data.coords) {
                                let coords;
                                if (typeof data.coords === 'string') {
                                    coords = JSON.parse(data.coords);
                                } else {
                                    coords = data.coords;
                                }

                                return <District
                                    coords={coords}
                                    lineType={data.objectType}
                                    pixelDims={pixelDims}
                                    mapLatLngBounds={mapLatLngBounds}
                                    cssClassName='district'
                                    setInfo={setInfo}
                                />
                            }
                        })}
                        {/* <rect
                            x="800"
                            y="400"
                            width="150"
                            height="150"
                            className="rect"
                        /> */}

                    </svg>
                    <div className='infoblock'>{info}</div>
                </div>
            </>
        );
    } else {
        return <div>Ждёмс...</div>;
    }
}

export default App;
