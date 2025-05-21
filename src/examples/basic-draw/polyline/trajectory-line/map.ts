import { Color, Cartesian3, GeometryInstance , PolylineGeometry,PolylineMaterialAppearance,Material,Primitive,UrlTemplateImageryProvider} from 'geokey-gis';
import imgUrl from "image/meteor_01.png"
export function loadLayer(){
  window.viewer.imageryLayers.addImageryProvider(new UrlTemplateImageryProvider({
    id: 'lanheiseDZ',
    url: 'http://basemap.igeokey.com:12023/basemap/gis/getArcgisMap/9/{z}/{y}/{x}'
}))
}
export function loadDynamicLine(data) {
  const geometryInstance = new GeometryInstance({
    geometry: new PolylineGeometry({
      positions: Cartesian3.fromDegreesArray(data),
      width: 10,
      vertexFormat: PolylineMaterialAppearance.VERTEX_FORMAT,
    })
  })

  const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAKCAYAAADxeBEhAAABNGlDQ1BBZG9iZSBSR0IgKDE5OTgpAAAoz62RsUrDUBSGvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5XSJNzcqn0IR7cOLu4+gZOj4KD4BL6B4tTBIUhwEsFv+s7P4XDgB6Ni152GUYZBrFW76UjX8+XsEzNMAUAnzFK71ToAiJM44icCPl8RAM+bdt1p8Dfmw1RpYAJsd6MsBFEB+hc61SDGgBn0Uw3iDjDVSbsG4gEo9XJ/AUpB7m9ASbmeD+IDMHuu54MxB5hB7iuAqaNLDVBL0pE6651qWbUsS9rdJIjk8SjT0SCT+3GYqDRRHR11gfw/ABbzxXbTkWtVy9pb559xPV/m9n6EAMTSY5EVhEN1/t2FsfP7XNwYL8PhLUxPimz3Cm42YOG6yFarUN6C+/EXwrNP/qlYXMIAAAAJcEhZcwAALiMAAC4jAXilP3YAAAX5aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDQtMjlUMTc6NTE6MDkrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDQtMjlUMTc6NTE6MDkrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTA0LTI5VDE3OjUxOjA5KzA4OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkxMzMzMTA2LTI2OWMtYjM0My05ZTk1LTk4YzgxOTRmMmQ3YyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmYxMmI5MTkwLWE3MTktNTg0ZS04MzhmLWU3OTc5NGE0NDM3NCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjlkMTAyNzkyLTlhOTMtNDY0NS05ZjBhLWNlNDg4Y2FiYjVhNiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJBZG9iZSBSR0IgKDE5OTgpIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZDEwMjc5Mi05YTkzLTQ2NDUtOWYwYS1jZTQ4OGNhYmI1YTYiIHN0RXZ0OndoZW49IjIwMjQtMDQtMjlUMTc6NTE6MDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTEzMzMxMDYtMjY5Yy1iMzQzLTllOTUtOThjODE5NGYyZDdjIiBzdEV2dDp3aGVuPSIyMDI0LTA0LTI5VDE3OjUxOjA5KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cyki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';

  // 自定义材质
  const material = new Material({
    translucent: true,
    fabric: {
      uniforms: {
        color: Color.fromRandom({ alpha: 1 }),
        image: "image/meteor_01.png",
        speed: 5,
      },
      source: `
          czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            float st_map_s = fract(st.s - speed * czm_frameNumber * 0.001);
            vec4 colorImage = texture2D(image, vec2(st_map_s, st.t));
            vec4 fragColor;
            fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;
            fragColor = czm_gammaCorrect(fragColor);
            material.alpha = colorImage.a * color.a;
            material.diffuse = fragColor.rgb;// 设置漫反射颜色
            material.emission = fragColor.rgb;// 设置自发光颜色
            return material;
          }
        `,
    },
  });
  const primitive = new Primitive({
    geometryInstances: [geometryInstance],
    appearance: new PolylineMaterialAppearance({
      material: material
    }),
    asynchronous: false,
  });

  window.viewer.scene.primitives.add(primitive)
}


