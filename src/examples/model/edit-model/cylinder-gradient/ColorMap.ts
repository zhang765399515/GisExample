class ColorMap {
  constructor(options) {
    this.maxvalue = options.maxvalue;
    this.minvalue = options.minvalue;
    this.maxcolor = options.maxcolor || 0xFF0000;
    this.mincolor = options.mincolor || 0x0000ff;
  }

  fromValue(value) {
    return this.mapTemperatureToColor(value, [this.minvalue, this.maxvalue], [this.mincolor, this.maxcolor]);
  }

  // 温度到颜色的映射函数
  mapTemperatureToColor(temperature, temperatureRange, colorRange) {
    var t =
      (temperature - temperatureRange[0]) /
      (temperatureRange[1] - temperatureRange[0]);
    t = Math.min(1, Math.max(0, t)); // 限制在[0, 1]范围内
    var color = this.interpolateColor(colorRange[0], colorRange[1], t);
    // return Cesium.Color.fromBytes(color[0], color[1], color[2]);
    return {
      color,
      t
    }
  }

  // 颜色插值函数
  // interpolateColor(color1, color2, t) {
  //   var r = Math.round(color1 >> (16 + ((color2 >> (16 - color1)) >> 16) * t));
  //   var g = Math.round(
  //     ((color1 >> 8) & 0xff) +
  //       (((color2 >> 8) & 0xff) - ((color1 >> 8) & 0xff)) * t
  //   );
  //   var b = Math.round(
  //     (color1 & 0xff) + ((color2 & 0xff) - (color1 & 0xff)) * t
  //   );
  //   return [r, g, b];
  // }
  interpolateColor(color1, color2, t) {
    var r = Math.round((color1 >> 16) + ((color2 >> 16) - (color1 >> 16)) * t);
    var g = Math.round((color1 >> 8 & 0xFF) + ((color2 >> 8 & 0xFF) - (color1 >> 8 & 0xFF)) * t);
    var b = Math.round((color1 & 0xFF) + ((color2 & 0xFF) - (color1 & 0xFF)) * t);
    return `${r}, ${g}, ${b}`;
}
}

export default ColorMap;
