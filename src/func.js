export function latlngToPxGlobe(item, g, d, R) {
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
        return [x, y];
    } else {
        let earthY = R * Math.cos(lat - arcdegreeD) * Math.sin(lng);
        let earthZ = R * Math.sin(lat - arcdegreeD);
        let x = earthX * Math.sin(arcdegree) + earthY * Math.cos(arcdegree) + R;
        let y = R - earthZ;
        return [x, y];
    }
}