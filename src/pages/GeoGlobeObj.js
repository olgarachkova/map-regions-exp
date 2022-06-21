import { latlngToPxGlobe } from '../func';

export function GeoGlobeObj(props) {
    let { countryCoords, type, g, d, R, setG, setD } = props;

    let polygonPoints = [];

    if (type === 'Polygon') {
        let coords = JSON.parse(countryCoords);
        let geoPoints = coords[0].map((item) => {
            return latlngToPxGlobe(item, g, d, R).join(' ');
        });

        polygonPoints.push(geoPoints);
    } else {
        let coords = JSON.parse(countryCoords)
        coords.forEach((crds) => {
            let geoPoints = crds[0].map(item => {
                return latlngToPxGlobe(item, g, d, R).join(' ');
            });

            polygonPoints.push(geoPoints);
        })
    }

    const handleClick = () => {
        console.log(g, d);
        setG(50);
        setD(10);
    }

    return <g
        className={'country'}
        onClick={handleClick}
    >
        {polygonPoints.map((points, i) =>
            <polygon
                key={i}
                points={points}
            >
            </polygon>)}
    </g>
}