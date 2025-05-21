/*  Global class for simulating the movement of particle through a 1km wind grid
    credit: All the credit for this work goes to: https://github.com/cambecc for creating the repo:
      https://github.com/cambecc/earth. The majority of this code is directly take nfrom there, since its awesome.
    This class takes a canvas element and an array of data (1km GFS from http://www.emc.ncep.noaa.gov/index.php?branch=GFS)
    and then uses a mercator (forward/reverse) projection to correctly map wind vectors in "map space".
    The "start" method takes the bounds of the map at its current extent and starts the whole gridding,
    interpolation and animation process.
*/

// this.x = null;//粒子初始x位置(相对于棋盘网格，比如x方向有360个格，x取值就是0-360，这个是初始化时随机生成的)
// this.y = null;//粒子初始y位置(同上)
// this.tx = null;//粒子下一步将要移动的x位置，这个需要计算得来
// this.ty = null;//粒子下一步将要移动的y位置，这个需要计算得来
// this.age = null;//粒子生命周期计时器，每次-1


function Windy(params: any) {
  const VELOCITY_SCALE = 0.011;             // scale for wind velocity (completely arbitrary--this value looks nice)
  const INTENSITY_SCALE_STEP = 10;            // step size of particle intensity color scale
  const MAX_TASK_TIME = 1000;					// amount of time before a task yields control (millis)
  const MIN_SLEEP_TIME = 25;                  // amount of time a task waits before resuming (millis)
  const MAX_WIND_INTENSITY = 40;              // wind velocity at which particle intensity is maximum (m/s)
  const MAX_PARTICLE_AGE = 100;                //  max number of frames a particle is drawn before regeneration  绘制粒子的最大帧数
  const PARTICLE_LINE_WIDTH = 1;              // line width of a drawn particle
  const PARTICLE_MULTIPLIER = 3;              // particle count scalar (completely arbitrary--this values looks nice) scale: [5, 10, 15, 20, 25, 30, 35, 40] 粒子计数标量
  const PARTICLE_REDUCTION = 0.75;            // reduce particle count to this much of normal for mobile devices
  const FRAME_RATE = 50;                      // desired milliseconds per frame
  const BOUNDARY = 0.45;

  const NULL_WIND_VECTOR = [NaN, NaN, null];  // singleton for no wind in the form: [u, v, magnitude]
  const TRANSPARENT_BLACK = [255, 0, 0, 0];

  const τ = 2 * Math.PI;
  const H = Math.pow(10, -5.2);
  const globe = window.windGlobe;

  // interpolation for vectors like wind (u,v,m)  风的矢量插值
  function bilinearInterpolateVector(x: number, y: number, g00: number[], g10: number[], g01: number[], g11: number[]) {
    let rx = (1 - x);
    let ry = (1 - y);
    let a = rx * ry, b = x * ry, c = rx * y, d = x * y;
    let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    return [u, v, Math.sqrt(u * u + v * v)];
  };


  function createWindBuilder(uComp: any, vComp: any) {
    let uData = uComp.data, vData = vComp.data;
    return {
      header: uComp.header,
      //recipe: recipeFor("wind-" + uComp.header.surface1Value),
      data: function (i: number) {
        return [uData[i], vData[i]];
      },
      interpolate: bilinearInterpolateVector
    }
  };

  function createBuilder(data: any) {
    let uComp = null, vComp = null, scalar = null;

    data.forEach((record: any) => {
      switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
        case "2,2":
          uComp = record;
          break;
        case "2,3":
          vComp = record;
          break;
        default:
          scalar = record;
      }
    });

    return createWindBuilder(uComp, vComp);
  };

  function buildGrid(data: any, callback: any) {
    let builder = createBuilder(data);
    let header = builder.header;
    let λ0 = header.lo1, φ0 = header.la1;  // the grid's origin (e.g., 0.0E, 90.0N)
    let Δλ = header.dx, Δφ = header.dy;    // distance between grid points (e.g., 2.5 deg lon, 2.5 deg lat)
    let ni = header.nx, nj = header.ny;    // number of grid points W-E and N-S (e.g., 144 x 73)
    let date = new Date(header.refTime);
    date.setHours(date.getHours() + header.forecastTime);

    // Scan mode 0 assumed. Longitude increases from λ0, and latitude decreases from φ0.
    //假设扫描模式为0。经度从λ0开始增大，纬度从φ0开始减小

    // http://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_table3-4.shtml
    let grid: any = [], p = 0;
    let isContinuous = Math.floor(ni * Δλ) >= 360;
    for (let j = 0; j < nj; j++) {
      let row = [];
      for (let i = 0; i < ni; i++, p++) {
        row[i] = builder.data(p);
      }
      if (isContinuous) {
        // For wrapped grids, duplicate first column as last column to simplify interpolation logic
        row.push(row[0]);
      }
      grid[j] = row;
    }

    function interpolate(λ: number, φ: number) {
      let i = floorMod(λ - λ0, 360) / Δλ;  // calculate longitude index in wrapped range [0, 360)
      let j = (φ0 - φ) / Δφ;                 // calculate latitude index in direction +90 to -90

      let fi = Math.floor(i), ci = fi + 1;
      let fj = Math.floor(j), cj = fj + 1;

      let row;
      if ((row = grid[fj])) {
        let g00 = row[fi];
        let g10 = row[ci];
        if (isValue(g00) && isValue(g10) && (row = grid[cj])) {
          let g01 = row[fi];
          let g11 = row[ci];
          if (isValue(g01) && isValue(g11)) {
            // All four points found, so interpolate the value. 四个点都找到了，所以插值
            return builder.interpolate(i - fi, j - fj, g00, g10, g01, g11);
          }
        }
      }
      return null;
    }

    callback({
      date: date,
      interpolate: interpolate
    });
  };


  /**
   * @returns {Boolean} true if the specified value is not null and not undefined.
   */
  function isValue(x: any): boolean {
    return x !== null && x !== undefined;
  }

  /**
   * @returns {Number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
   *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
   */
  function floorMod(a: number, n: number) {
    return a - n * Math.floor(a / n);
  }

  /**
   * @returns {Number} the value x clamped to the range [low, high].
   */
  function clamp(x: number, range: number[]) {
    return Math.max(range[0], Math.min(x, range[1]));
  }

  /**
   * @returns {Boolean} true if agent is probably a mobile device. Don't really care if this is accurate.
   */
  let isMobile = function () {
    return (/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i).test(navigator.userAgent);
  }

  /**
   * Calculate distortion of the wind vector caused by the shape of the projection at point (x, y). The wind
   * vector is modified in place and returned by this function.
   * 计算由点（x，y）的投影形状引起的风矢量畸变。风矢量被就地修改并由该函数返回
   */
  function distort(projection: any, λ: number, φ: number, x: number, y: number, scale: number, wind: number[]) {
    let u = wind[0] * scale;
    let v = wind[1] * scale;

    let d = distortion(projection, λ, φ, x, y);

    // Scale distortion vectors by u and v, then add.
    wind[0] = d[0] * u + d[2] * v;
    wind[1] = d[1] * u + d[3] * v;
    return wind;
  };

  function distortion(projection: any, λ: number, φ: number, x: number, y: number) {
    let τ = 2 * Math.PI;
    let G = 36e-6;
    let i = λ < 0 ? G : -G
      , a = φ < 0 ? G : -G
      , u = projection([λ + i, φ])
      , c = projection([λ, φ + a])
      , s = Math.cos(φ / 360 * τ);
    return [(u[0] - x) / i / s, (u[1] - y) / i / s, (c[0] - x) / a, (c[1] - y) / a];
  }


  function createField(columns: any, bounds: any, callback: (bounds: any, field: any) => void) {

    /**
     * @returns {Array} wind vector [u, v, magnitude] at the point (x, y), or [NaN, NaN, null] if wind
     *          is undefined at that point.
     */
    function field(x: number, y: number) {
      let column = columns[Math.round(x)];
      return column && column[Math.round(y)] || NULL_WIND_VECTOR;
    }


    /**
     * @returns {boolean} true if the field is valid at the point (x, y)
     */
    field.isDefined = function (x: number, y: number) {
      return field(x, y)[2] !== null;
    };

    /**
     * @returns {boolean} true if the point (x, y) lies inside the outer boundary of the vector field, even if
     *          the vector field has a hole (is undefined) at that point, such as at an island in a field of
     *          ocean currents.
     */
    field.isInsideBoundary = function (x: number, y: number) {
      return field(x, y) !== NULL_WIND_VECTOR;
    };

    // Frees the massive "columns" array for GC. Without this, the array is leaked (in Chrome) each time a new
    // field is interpolated because the field closure's context is leaked, for reasons that defy explanation.
    field.release = function () {
      columns = [];
    };

    field.randomize = function (o: any) {  // UNDONE: this method is terrible
      let x, y;
      let safetyNet = 0;
      do {
        x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
        y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y)
      } while (field(x, y)[2] === null && safetyNet++ < 30);
      o.x = x;
      o.y = y;
      return o;
    };

    callback(bounds, field);
  };

  function buildBounds(bounds: any, width: number, height: number) {
    let upperLeft = bounds[0];
    let lowerRight = bounds[1];
    let x = Math.round(upperLeft[0]);
    let y = Math.max(Math.floor(upperLeft[1]), 0);
    let xMax = Math.min(Math.ceil(lowerRight[0]), width - 1);
    let yMax = Math.min(Math.ceil(lowerRight[1]), height - 1);
    return { x: x, y: y, xMax: width, yMax: yMax, width: width, height: height };
  };

  function deg2rad(deg: number) {
    return (deg / 180) * Math.PI;
  };

  function rad2deg(ang: number) {
    return ang / (Math.PI / 180.0);
  };

  function invert(x: number, y: number, windy: any) {
    let mapLonDelta = windy.east - windy.west;
    let worldMapRadius = windy.width / rad2deg(mapLonDelta) * 360 / (2 * Math.PI);
    let mapOffsetY = (worldMapRadius / 2 * Math.log((1 + Math.sin(windy.south)) / (1 - Math.sin(windy.south))));
    let equatorY = windy.height + mapOffsetY;
    let a = (equatorY - y) / worldMapRadius;

    let lat = 180 / Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
    let lon = rad2deg(windy.west) + x / windy.width * rad2deg(mapLonDelta);
    return [lon, lat];
  };

  function mercY(lat: number) {
    return Math.log(Math.tan(lat / 2 + Math.PI / 4));
  };


  function project(lat: number, lon: number, windy: any) { // both in radians, use deg2rad if neccessary
    let ymin = mercY(windy.south);
    let ymax = mercY(windy.north);
    let xFactor = windy.width / (windy.east - windy.west);
    let yFactor = windy.height / (ymax - ymin);

    let y = mercY(deg2rad(lat));
    let x = (deg2rad(lon) - windy.west) * xFactor;
    y = (ymax - y) * yFactor; // y points south
    return [x, y];
  };

  function calcSparseFactor(globe: any) {
    let viewRect = globe.viewRect();
    let minRange = Math.min(Math.abs(viewRect.east - viewRect.west), Math.abs(viewRect.north - viewRect.south));
    let factor = Math.sqrt(minRange / 90);
    return factor;
  }

  function interpolateField(grid: any, bounds: any, callback: any) {
    let projection = globe.PGEarthWGS84ToWindowCoord;
    // How fast particles move on the screen (arbitrary value chosen for aesthetics).
    let sparseFactor = calcSparseFactor(globe);
    let scale = 1 / 40000;
    let velocityScale = bounds.height * scale * Math.min(3.0, sparseFactor);
    //let velocityScale = VELOCITY_SCALE;

    let columns: any = [];
    let x = bounds.x;

    function interpolateColumn(x: any) {
      let column = [];
      for (let y = bounds.y; y <= bounds.yMax; y += 2) {
        //let coord = invert( x, y, extent );
        let coord = globe.PGEarthWindowToWGS84(x, y);
        if (coord) {
          let λ = coord[0], φ = coord[1];
          if (isFinite(λ)) {
            let wind = grid.interpolate(λ, φ);
            if (wind) {
              wind = distort(projection, λ, φ, x, y, velocityScale, wind/*, extent*/);
              column[y + 1] = column[y] = wind;

            }
          }
        }
      }
      columns[x + 1] = columns[x] = column;
    }

    (function batchInterpolate() {
      let start = Date.now();
      while (x < bounds.width) {
        interpolateColumn(x);
        x += 2;
        if ((Date.now() - start) > MAX_TASK_TIME) {
          setTimeout(batchInterpolate, MIN_SLEEP_TIME);
          return;
        }
      }
      createField(columns, bounds, callback);
    })();
  };


  function animate(bounds: any, field: any) {

    function asColorStyle(r: number | string, g: number | string, b: number | string, a: number | string) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    function hexToR(h: string) {
      return parseInt((cutHex(h)).substring(0, 2), 16)
    }

    function hexToG(h: string) {
      return parseInt((cutHex(h)).substring(2, 4), 16)
    }

    function hexToB(h: string) {
      return parseInt((cutHex(h)).substring(4, 6), 16)
    }

    function cutHex(h: string) {
      return (h.charAt(0) == "#") ? h.substring(1, 7) : h
    }

    function windIntensityColorScale(step: any, maxWind: any) {

      const result: any = [
        //blue to red
        "rgba(" + hexToR('#178be7') + ", " + hexToG('#178be7') + ", " + hexToB('#178be7') + ", " + 1 + ")",
        "rgba(" + hexToR('#8888bd') + ", " + hexToG('#8888bd') + ", " + hexToB('#8888bd') + ", " + 1 + ")",
        "rgba(" + hexToR('#b28499') + ", " + hexToG('#b28499') + ", " + hexToB('#b28499') + ", " + 1 + ")",
        "rgba(" + hexToR('#cc7e78') + ", " + hexToG('#cc7e78') + ", " + hexToB('#cc7e78') + ", " + 1 + ")",
        "rgba(" + hexToR('#de765b') + ", " + hexToG('#de765b') + ", " + hexToB('#de765b') + ", " + 1 + ")",
        "rgba(" + hexToR('#ec6c42') + ", " + hexToG('#ec6c42') + ", " + hexToB('#ec6c42') + ", " + 1 + ")",
        "rgba(" + hexToR('#f55f2c') + ", " + hexToG('#f55f2c') + ", " + hexToB('#f55f2c') + ", " + 1 + ")",
        "rgba(" + hexToR('#fb4f17') + ", " + hexToG('#fb4f17') + ", " + hexToB('#fb4f17') + ", " + 1 + ")",
        "rgba(" + hexToR('#fe3705') + ", " + hexToG('#fe3705') + ", " + hexToB('#fe3705') + ", " + 1 + ")",
        "rgba(" + hexToR('#ff0000') + ", " + hexToG('#ff0000') + ", " + hexToB('#ff0000') + ", " + 1 + ")",
        "rgba(" + hexToR('#00ffff') + ", " + hexToG('#00ffff') + ", " + hexToB('#00ffff') + ", " + 0.5 + ")",
        "rgba(" + hexToR('#64f0ff') + ", " + hexToG('#64f0ff') + ", " + hexToB('#64f0ff') + ", " + 0.5 + ")",
        "rgba(" + hexToR('#87e1ff') + ", " + hexToG('#87e1ff') + ", " + hexToB('#87e1ff') + ", " + 0.5 + ")",
        "rgba(" + hexToR('#a0d0ff') + ", " + hexToG('#a0d0ff') + ", " + hexToB('#a0d0ff') + ", " + 0.5 + ")",
        "rgba(" + hexToR('#b5c0ff') + ", " + hexToG('#b5c0ff') + ", " + hexToB('#b5c0ff') + ", " + 0.5 + ")",
        "rgba(" + hexToR('#c6adff') + ", " + hexToG('#c6adff') + ", " + hexToB('#c6adff') + ", " + 0.5 + ")",
        "rgba(" + hexToR('#d49bff') + ", " + hexToG('#d49bff') + ", " + hexToB('#d49bff') + ", " + 0.5 + ")",
        "rgba(" + hexToR('#e185ff') + ", " + hexToG('#e185ff') + ", " + hexToB('#e185ff') + ", " + 0.5 + ")",
        "rgba(" + hexToR('#ec6dff') + ", " + hexToG('#ec6dff') + ", " + hexToB('#ec6dff') + ", " + 0.5 + ")",
        "rgba(" + hexToR('#ff1edb') + ", " + hexToG('#ff1edb') + ", " + hexToB('#ff1edb') + ", " + 0.5 + ")"
      ]
      result.indexFor = function (m: any) {  // map wind speed to a style
        return Math.floor(Math.min(m, maxWind) / maxWind * (result.length - 1));
      };
      return result;
    }

    let colorStyles = windIntensityColorScale(INTENSITY_SCALE_STEP, MAX_WIND_INTENSITY);
    //let colorStyles = µ.windIntensityColorScale(INTENSITY_SCALE_STEP, 17);
    let buckets = colorStyles.map(function () {
      return [];
    });

    let particleCount = Math.round(bounds.width * PARTICLE_MULTIPLIER);
    if (isMobile()) {
      particleCount *= PARTICLE_REDUCTION;
    }

    const fadeFillStyle = "rgba(255, 0, 0, 0.95)";

    let particles: any = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(field.randomize({ age: Math.floor(Math.random() * MAX_PARTICLE_AGE) + 0 }));
    }

    function evolve() {
      buckets.forEach(function (bucket: any) {
        bucket.length = 0;
      });
      particles.forEach(function (particle: any) {
        if (particle.age > MAX_PARTICLE_AGE) {
          field.randomize(particle).age = 0;
        }
        // console.log(particle)
        let x = particle.x;
        let y = particle.y;
        let v = field(x, y);  // vector at current position
        let m = v[2];
        if (m === null) {
          particle.age = MAX_PARTICLE_AGE;  // particle has escaped the grid, never to return...
        } else {
          /*let xt = x + v[0];
          let yt = y + v[1];*/
          let xt = x + v[0] / 3.0;
          let yt = y + v[1] / 3.0;
          if (field(xt, yt)[2] !== null) {
            // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
            particle.xt = xt;
            particle.yt = yt;
            buckets[colorStyles.indexFor(m)].push(particle);
          } else {
            // Particle isn't visible, but it still moves through the field.
            particle.x = xt;
            particle.y = yt;
          }
        }
        particle.age += 1;
      });
    }

    let g = params.canvas.getContext("2d");
    g.lineWidth = PARTICLE_LINE_WIDTH;
    g.fillStyle = fadeFillStyle;

    function draw() {
      // Fade existing particle trails.
      let prev = g.globalCompositeOperation;
      g.globalCompositeOperation = "destination-in";
      g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      g.globalCompositeOperation = prev;

      // Draw new particle trails.
      buckets.forEach(function (bucket: any, i: number) {
        if (bucket.length > 0) {
          g.beginPath();
          g.strokeStyle = colorStyles[i];
          //g.strokeStyle = 'rgba(224,102,255,0.5)';
          bucket.forEach(function (particle: any) {
            g.moveTo(particle.x, particle.y);
            g.lineTo(particle.xt, particle.yt);
            particle.x = particle.xt;
            particle.y = particle.yt;
          });
          g.stroke();
        }
      });
    }

    (function frame() {
      try {
        windy.timer = setTimeout(function () {
          requestAnimationFrame(frame);
          evolve();
          draw();
        }, 1000 / FRAME_RATE);
      } catch (e) {
        console.error(e);
      }
    })();
  }

  function start(bounds: any, width: number, height: number) {
    stop();

    buildGrid(params.data, function (grid: any) {
      // interpolateField
      interpolateField(grid, buildBounds(bounds, width, height), function (bounds: any, field: any) {
        // animate the canvas with random points
        windy.field = field;
        animate(bounds, field);
      });

    });
    return true;
  };

  let stop = function () {
    if (windy.field) windy.field.release();
    if (windy.timer) clearTimeout(windy.timer)
  };


  let windy: any = {
    params: params,
    start: start,
    stop: stop
  };

  return windy;
}

export default Windy;
// shim layer with setTimeout fallback
window.requestAnimationFrame = (function () {
  return window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    (window as any).oRequestAnimationFrame ||
    (window as any).msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 50);
    };
})();
