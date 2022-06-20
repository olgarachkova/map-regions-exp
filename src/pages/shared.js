const Lines = () => {

  let x1 = 300;
  let y1 = 0;

  let x2 = 0;
  let y2 = 600;

  let angle_rise = 1;
  let angle_reduction = 0;

  let rx = 0;
  let ry = 0;

  let rx_step = 0;
  let ry_step = 0;

  const arr_parallel = [...Array(5).keys()];


  return (
    <>
      {
        arr_parallel.map((_, pos) => {
          if ((parseInt(arr_parallel.length / 2)) >= pos) {
            if (pos > 0) {
              rx = 20 + rx_step;
              ry = 25 + ry_step;

              rx_step = rx_step;
              ry_step = ry_step + 25;
            }
            return (
              <path d={`M${x1},${y1} a${rx},${ry} 0 0,${angle_rise} ${x2},${y2}`} />
            )
          }
          if ((parseInt(arr_parallel.length / 2)) < pos) {
            if (pos > (parseInt(arr_parallel.length / 2)) + 1) {
              rx = 20 + rx_step;
              ry = ry_step - 25;
            }
            return (
              <path d={`M${x1},${y1} a${rx},${ry} 0 0,${angle_reduction} ${x2},${y2}`} />
            )
          }

        })

      }
      {/* <path d="M10,215 a400,50 0 0,0 580, 0" />
    <path d="M10,385 a400,50 0 0,1 580, 0" />

    <path d="M40,130 a300,60 0 0,0 520, 0" />
    <path d="M40,470 a300,60 0 0,1 520, 0" />  */}
      {/* <path d="M300,0 a15,50 0 0,1 0,600" />
    <path d="M300,0 a25,40 0 0,1 0,600" />
    <path d="M300,0 a25,30 0 0,1 0,600" />
    <path d="M300,0 a0,0 0 0,0 0,600" />
    <path d="M300,0 a20,25 0 0,0 0,600" />
    <path d="M300,0 a20,50 0 0,0 0,600" />

      <path d="M0,300 a0, 0 0 0, 0 600, 0" />
 */}

      {/* <path d="M0,300 l600,0" />
    <path d="M10,220 l580,0" />
    <path d="M10,380 l580,0" /> */}
      {/* <path d="M61,80 l580,0" /> */}

      {/* <path d="M9,240 l581,0" />
    <path d="M61,8.2 580,0" />
    <path d="M61,191.2 580,0" /> */}
    </>
  )
}

const LinesX = () => {
  let x1 = 0;
  let y1 = 300;

  let y1t = 300;

  let x2 = 600;
  let y2 = 0;

  let angle_rise = 1;
  let angle_reduction = 0;

  let rx = 0;
  let ry = 0;

  let y1_step = 85;

  const arr_meridians = [...Array(7).keys()];
  return (
    <>
      {
        arr_meridians.map((_, pos) => {
          if ((parseInt(arr_meridians.length / 2)) >= pos) {
            if (pos > 0) {
              y1 = y1 + y1_step;
              rx = 400;
              ry = 70;
            }
            return (
              <path d={`M${x1},${y1} a${rx},${ry} 0 0,${angle_rise} ${x2},${y2}`} />
            )
          }
          if ((parseInt(arr_meridians.length / 2)) < pos) {
            if (pos > (parseInt(arr_meridians.length / 2))) {
              y1t = y1t - y1_step;
            }
            return (
              <path d={`M${x1},${y1t} a${rx},${ry} 0 0,${angle_reduction} ${x2},${y2}`} />
            )
          }
        })
      }
    </>
  )
}

const Points = () => {
  let x1 = 0;
  let y1 = 300;
  let x2 = 300;
  let y2 = 0;
  let arrPointsX = [];
  let arrPointsY = [];
  let arrPointsXY = [];

  while (x1 <= 600) {
    arrPointsX.push(x1)
    x1 = x1 + 30;
  }

  while (y2 <= 600) {
    arrPointsY.push(y2)
    y2 = y2 + 30;
  }

  {
    arrPointsX.map((x) => {
      arrPointsY.map((y) => {
        arrPointsXY.push(<circle key={x + y} cx={x} cy={y} r="1" fill="black" />)
      })
    })
  }

  return (
    <>
      {
        arrPointsXY.map((item) => {
          return (
            item
          )
        })
      }

      {/* {
      arrPointsY.map((item) => {
        return(
          <circle cx={x2} cy={item} r="1" fill="black"/>
        )
      })
    } */}
      {/* <circle cx={x1+10} cy={y1} r="1" fill="black"/>
    <circle cx={x2-10} cy={y2} r="1" fill="black"/> */}
    </>
  )
}

const Points3 = () => {
  let arrPoints = [];
  const R = 300;
  const step = 20;
  const x = 0;
    for (let x = 0; x <= 300; x += step) {
   
    let y = -Math.sqrt(R**2 - x**2);
      arrPoints.push(
        <> 
        <circle cx={x+R} cy={y+R} r="1" fill="black" />
        </>
       
      )
    }

    for (let x = 0; x <= 600; x += step) {

   
      let y = Math.sqrt(R**2 - x**2);
        arrPoints.push(
          <> 
          <circle cx={x+R} cy={y+R} r="1" fill="black" />
          </>
         
        )
      }



  return (

    arrPoints.map((item) => {
      return (
        item
      )
    })

  )
}
