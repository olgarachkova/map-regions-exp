import './App.scss';

import React, { useState, useEffect } from 'react';
import District from './District';
import River from './River';
import { getDistanceFromLatLngInKm, latlngToPx } from './func';

import russia from '../mid/russia.json';
import districts from '../mid/districts.json';
//import regions_nsk from '../mid/regions_nsk.json';
import regionsRussia from '../mid/regions.json';
import riversRussia from '../mid/rivers.json';
import Country from './Country';

interface IAppProps {
    regionId: number
}

export function App(props: IAppProps) {

    let regionId = props.regionId;
    let [bbLatMin, bbLatMax, bbLngMin, bbLngMax] = [41, 82.1, 19, 180];
    let lngSpan = bbLngMax - bbLngMin;
    let latSpan = bbLatMax - bbLatMin;



    const mapLatLngBounds = { latMin: bbLatMin, latMax: bbLatMax, lngMin: bbLngMin, lngMax: bbLngMax };
    const cartWidth = 1500;
    const heightCoef = latSpan / lngSpan / Math.cos(Math.PI / 180 * bbLatMin)
    const cartHeight = cartWidth * heightCoef;

    const [districtsForRegion, setDistrictsForRegion] = useState(null);
    const [country, setCountry] = useState(null);
    const [regions, setRegions] = useState(null);
    const [rivers, setRivers] = useState(null);
    const [info, setInfo] = useState('');
    const [rotateX, setRotateX] = useState(0);
    const [scale, setScale] = useState(1);
    const [width, setWidth] = useState(cartWidth);
    const [height, setHeight] = useState(cartHeight);
    const [districtOpacity, setDistrictOpacity] = useState('none');
    const [translateY, setTranslateY] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [administrativeLayerOn, setAdministrativeLayerOn] = useState(false);
    const [waterLayerOn, setWaterLayerOn] = useState(false);
    const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);

    let pixelDims = { width, height };

    useEffect(() => {
        setCountry(russia);
        setDistrictsForRegion(districts);
        setRegions(Object.values(regionsRussia));
        setRivers(riversRussia);
    }, [regionId]);

    const handleZoom = (add: number): void => {
        setScale(prev => prev + add * 0.001);
    }

    const handleTestAnswer = () => {
        setIsAnswerConfirmed(true);
        console.log(isAnswerConfirmed);
    }

    if (regions) {

        let countryCoords;
        if (typeof country.geojson.coordinates === 'string') {
            countryCoords = JSON.parse(country.geojson.coordinates);
        } else {
            countryCoords = country.geojson.coordinates;
        }

        return (
            <>
                <div
                    className="App"
                    onWheel={(e: React.SyntheticEvent<EventTarget>) => {
                        handleZoom(e.deltaY);
                    }}
                    style={{
                        height: `${cartHeight}px`,
                        width: `${cartWidth}px`
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={cartWidth}
                        height={cartHeight}
                        className='svg'
                        style={{
                            transform: `perspective(300px) 
                                        rotateX(${rotateX}deg) 
                                        scale(${scale})
                                        translate(${translateX}px, ${translateY}px)
                                        `,
                            transition: 'transform 2s'
                        }}
                    >
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

                        <Country
                            coords={countryCoords}
                            lineType={country.type}
                            mapLatLngBounds={mapLatLngBounds}
                            pixelDims={pixelDims}
                        />


                        {regions.map((region) => {
                            let coords;
                            if (typeof region.coords === 'string') {
                                coords = JSON.parse(region.coords);
                            } else { // for tests
                                coords = region.coords;
                            }

                            return <District
                                regionName={region.regionName}
                                coords={coords}
                                lineType={region.objectType}
                                pixelDims={pixelDims}
                                mapLatLngBounds={mapLatLngBounds}
                                cssClassName='district'
                                bbLatMin={region.bbLatMin}
                                bbLatMax={region.bbLatMax}
                                bbLngMin={region.bbLngMin}
                                bbLngMax={region.bbLngMax}
                                setInfo={setInfo}
                                setScale={setScale}
                                setTranslateY={setTranslateY}
                                setTranslateX={setTranslateX}
                                setDistrictOpacity={setDistrictOpacity}
                            />
                        })}

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
                                    cssClassName='districtForRegion'
                                    bbLatMin={data.bbLatMin}
                                    bbLatMax={data.bbLatMax}
                                    bbLngMin={data.bbLngMin}
                                    bbLngMax={data.bbLngMax}
                                    setInfo={setInfo}
                                    style={{
                                        stroke: `${districtOpacity}`,
                                        transition: 'stroke 2s'
                                    }}
                                />
                            }
                        })}
                        {waterLayerOn && rivers.map((river) => {
                            return <River
                                river={river}
                                mapLatLngBounds={mapLatLngBounds}
                                pixelDims={pixelDims}
                            />
                        })
                        }
                    </svg>
                </div>
                <div>
                    <p>Найдите на карте новосибирскую область</p>
                    <button
                        onClick={handleTestAnswer}
                        disabled={isAnswerConfirmed}
                    >
                        подтвердить ответ
                    </button>
                    {isAnswerConfirmed &&
                        <>
                            {info === 'Новосибирская область' ? <p>Верно</p> : <p>Неверно</p>}
                        </>
                    }
                </div>
            </>
        );

    } else {
        return <div>Ждёмс...</div>;
    }
}

export default App;
