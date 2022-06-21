import { useState } from 'react';
import countries from '../data/country.json';
import { GeoGlobeObj } from './GeoGlobeObj';

const country = [];
country.push(countries.find((c) => c.name === 'Brazil'))
country.push(countries.find((c) => c.name === 'Australia'))

export const MapGrid = () => {

  const [g, setG] = useState(0); // по X
  const [h, setH] = useState(0); // по кругу
  const [d, setD] = useState(0); // по Y
  const [scale, setScale] = useState(1); //


  const Points2 = () => {
    let arrPoints = [];
    const R = 400;
    const step = Math.PI / 30;
    for (let lng = 0; lng < 2 * Math.PI; lng += step) {
      for (let lat = -Math.PI / 2; lat < Math.PI / 2; lat += step) {

        const x = R * Math.cos(lng) * Math.sin(lat) + R;
        const y = R * (Math.cos((d * Math.PI) / 180) * Math.sin(lng) - Math.sin((d * Math.PI) / 180) * Math.cos(lng) * Math.cos(lat)) + R;

        let arcdegree = (g * Math.PI) / 180;

        let earthX = R * Math.cos(lat) * Math.cos(lng);
        let earthY = R * Math.cos(lat) * Math.sin(lng);

        if (Math.ceil(x) === R && Math.ceil(y) === R) {
          arrPoints.push(
            <>
              <circle cx={x} cy={y} r="3" fill="red" key={`${x} + ${y}`} />
            </>

          )
        } else {
          if (earthX * Math.cos(arcdegree) - earthY * Math.sin(arcdegree) >= 0) {
            arrPoints.push(
              <>
                <circle cx={x} cy={y} r="1" fill="black" key={`${x} + ${y}`} />
              </>

            )
          } else {
            arrPoints.push(
              <>
                <circle cx={x} cy={y} r="1" fill="grey" strokeWidth={0} key={`${x} + ${y}`} />
              </>)
          }
        }

      }
    }

    return (
      arrPoints.map((item, i) => {
        return (
          <g key={i}>{item}</g>
        )
      })

    )
  }

  let R = 400;

  return (
    <div className="earth1">


      <svg
        className="earth"

        style={{
          transform: `rotateZ(${h}deg) scale(${scale})`,
          transition: 'transform 2s'
        }}
        width={'808px'}
        height={'808px'}
      >
        <circle cx="400" cy="400" r="400" />

        <g className="points">
          <Points2 />
        </g>

        {country.map(c => <GeoGlobeObj
          countryCoords={c.coords}
          type={c.type}
          g={g}
          d={d}
          R={R}
          setG={setG}
          setD={setD}
          key={c.id}
        />
        )}
      </svg>

      <div className="btn">
        <button onClick={() => { setG(g => g + 5) }}>+5 градусов по X</button>

        <button onClick={() => { setD(d => d + 5) }}>+5 градусов по Y</button>

        <button onClick={() => { setH(h => h + 5) }}>+по кругу</button>
        <button onClick={() => { setH(h => h - 5) }}>-по кругу</button>

        <button onClick={() => { setD(d => d - 5) }}>-5 градусов по Y</button>

        <button onClick={() => { setG(g => g - 5) }}>-5 градусов по X</button>

        <button onClick={() => { setScale(prev => prev + 0.1) }}>+масштаб</button>
        <button onClick={() => { setScale(prev => prev - 0.1) }}>-масштаб</button>
      </div>
    </div>
  )
}