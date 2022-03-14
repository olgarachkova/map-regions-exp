import './App.scss';

import React, { useState, useEffect } from 'react';
import District from './District';
import { latlngToPx } from './func';

import districts from '../mid/districts.json';
import regions from '../mid/regions.json';

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
        let height = Math.round(width * latSpan / lngSpan) / Math.cos(Math.PI / 180 * bbLatMin); //  
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
                        <defs>
                            <pattern id="pattern1"
                                x="10" y="10" width="25" height="25"
                                patternUnits="userSpaceOnUse"
                            >

                                <circle cx="10" cy="10" r="10" className='pattern1' />

                            </pattern>

                            <pattern id="pattern2"
                                x="0" y="0" width="25" height="25"
                                patternUnits="userSpaceOnUse"
                                patternTransform="rotate(35)"
                            >

                                <rect x="0" y="15" width="50" height="50" className='pattern2' />

                            </pattern>
                        </defs>

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
