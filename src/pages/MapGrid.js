import { useState } from 'react';
import countries from '../data/country.json';


const country = [];
country.push(countries.find((c) => c.name === 'Brazil'))
country.push(countries.find((c) => c.name === 'Australia'))

export const MapGrid = () => {

  const [g, setG] = useState(0); // по X
  const [h, setH] = useState(0); // по кругу
  const [d, setD] = useState(0); // по Y


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
                <circle cx={x} cy={y} r="1" fill="grey" stroke-width={0} key={`${x} + ${y}`} />
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

  const countryPoints = (item, name) => {

    let R = 400;

    let arcdegree = (g * Math.PI) / 180;

    let arcdegreeD = (d * Math.PI) / 180;


    let lat = ((item[1]) * Math.PI) / 180;
    let lng = ((item[0]) * Math.PI) / 180;

    let earthX = R * Math.cos(lat) * Math.cos(lng);
    let earthY = R * Math.cos(lat) * Math.sin(lng);

    if (earthX * Math.cos(arcdegree) - earthY * Math.sin(arcdegree) >= 0) {
      let earthY = R * Math.cos(lat + arcdegreeD) * Math.sin(lng);
      let earthZ = R * Math.sin(lat + arcdegreeD);
      let x = earthX * Math.sin(arcdegree) + earthY * Math.cos(arcdegree) + R;
      let y = R - earthZ;
      return <circle cx={x} cy={y} r="1" fill="black" />;
    } else {
      let earthY = R * Math.cos(lat - arcdegreeD) * Math.sin(lng);
      let earthZ = R * Math.sin(lat - arcdegreeD);
      let x = earthX * Math.sin(arcdegree) + earthY * Math.cos(arcdegree) + R;
      let y = R - earthZ;
      return <circle cx={x} cy={y} r="1" fill="grey" stroke-width={0} />;
    }

  }

  let allPoints = [];

  country.map(c => {
    if (c.type === 'Polygon') {
      let coords = JSON.parse(c.coords)
      let lineation = coords[0].map((item) => {
        return countryPoints(item, c.name)
      });

      allPoints.push(lineation);
    } else {
      let coords = JSON.parse(c.coords)
      coords.forEach((crds) => {
        let lineation = crds[0].map(item => {
          return countryPoints(item, coords.name);
        });

        allPoints.push(lineation);
      })
    }
  })

  return (
    <>
      <svg className="earth" transform={`rotate(${h})`}>
        <circle cx="400" cy="400" r="400" />
        <g>
          {
            allPoints.map((item, i) =>
              <g key={i}>{item}</g>
            )
          }
        </g>

        <g className="points">
          <Points2 />
        </g>

      </svg>

      <div className="btn">
        <button onClick={() => { setG(g + 5) }}>+5 градусов по X</button>

        <button onClick={() => { setD(d + 5) }}>+5 градусов по Y</button>

        <button onClick={() => { setH(h + 5) }}>+по кругу</button>
        <button onClick={() => { setH(h - 5) }}>-по кругу</button>

        <button onClick={() => { setD(d - 5) }}>-5 градусов по Y</button>

        <button onClick={() => { setG(g - 5) }}>-5 градусов по X</button>
      </div>
    </>
  )
}