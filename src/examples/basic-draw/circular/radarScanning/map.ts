import { 
    Color,
    Cartesian4,
    Ellipsoid,
    CMath,
    Cartesian3,
    Quaternion,
    Matrix3,
    PostProcessStage,
    Matrix4,
 } from "geokey-gis"
export function drewRadarScanning(options){
    window.viewer.scene.globe.depthTestAgainstTerrain = true; //开启坐标深度拾取
    if (options && options.position) {
      window.viewer.camera.flyTo({
        destination:Cartesian3.fromDegrees(113.958782,22.540359,5000)
      })
      var id = options.id || 'radarScan' + parseInt(Math.random() * 1000),
        position = options.position,
        radius = options.radius,
        color = options.color || Color.RED,
        duration = options.duration || 1500,
        border = options.border || 1,
        width = options.width || 3.0

      var cartesian3Center = Cartesian3.fromDegrees(position[0],position[1],position[2])
      var cartesian4Center = new Cartesian4( cartesian3Center.x, cartesian3Center.y, cartesian3Center.z, 1 )

      var cartesian3Center1 = Cartesian3.fromDegrees(position[0],position[1],position[2] + 500)
      var cartesian4Center1 = new Cartesian4( cartesian3Center1.x, cartesian3Center1.y, cartesian3Center1.z, 1 )
      var cartesian3Center2 = Cartesian3.fromDegrees(position[0]+0.001,position[1],position[2])
      var cartesian4Center2 = new Cartesian4( cartesian3Center2.x, cartesian3Center2.y, cartesian3Center2.z, 1 )
      var _time = new Date().getTime()
      var _RotateQ = new Quaternion()
      var _RotateM = new Matrix3()
      var _scratchCartesian4Center = new Cartesian4()
      var _scratchCartesian4Center1 = new Cartesian4()
      var _scratchCartesian4Center2 = new Cartesian4()
      var _scratchCartesian3Normal = new Cartesian3()
      var _scratchCartesian3Normal1 = new Cartesian3()
      var _delegate = new PostProcessStage({
        name: id,
        fragmentShader: _getRadarScanShader({
          border: border,
          width: width,
          get: true
        }),
        uniforms: {
          u_scanCenterEC: function () {
            return Matrix4.multiplyByVector(
              window.viewer.camera.viewMatrix,
              cartesian4Center,
              _scratchCartesian4Center
            )
          },
          u_scanPlaneNormalEC: function () {
            var temp = Matrix4.multiplyByVector(
              window.viewer.camera.viewMatrix,
              cartesian4Center,
              _scratchCartesian4Center
            )
            var temp1 = Matrix4.multiplyByVector(
              window.viewer.camera.viewMatrix,
              cartesian4Center1,
              _scratchCartesian4Center1
            )
            _scratchCartesian3Normal.x = temp1.x - temp.x
            _scratchCartesian3Normal.y = temp1.y - temp.y
            _scratchCartesian3Normal.z = temp1.z - temp.z
            Cartesian3.normalize(
              _scratchCartesian3Normal,
              _scratchCartesian3Normal
            )
            return _scratchCartesian3Normal
          },

          u_scanLineNormalEC: function () {
            var temp = Matrix4.multiplyByVector(
              window.viewer.camera.viewMatrix,
              cartesian4Center,
              _scratchCartesian4Center
            )
            var temp1 = Matrix4.multiplyByVector(
              window.viewer.camera.viewMatrix,
              cartesian4Center1,
              _scratchCartesian4Center1
            )
            var temp2 = Matrix4.multiplyByVector(
              window.viewer.camera.viewMatrix,
              cartesian4Center2,
              _scratchCartesian4Center2
            )

            _scratchCartesian3Normal.x = temp1.x - temp.x
            _scratchCartesian3Normal.y = temp1.y - temp.y
            _scratchCartesian3Normal.z = temp1.z - temp.z

            Cartesian3.normalize(
              _scratchCartesian3Normal,
              _scratchCartesian3Normal
            )

            _scratchCartesian3Normal1.x = temp2.x - temp.x
            _scratchCartesian3Normal1.y = temp2.y - temp.y
            _scratchCartesian3Normal1.z = temp2.z - temp.z

            var tempTime =
              ((new Date().getTime() - _time) % duration) / duration
            Quaternion.fromAxisAngle(
              _scratchCartesian3Normal,
              tempTime * CMath.PI * 2,
              _RotateQ
            )
            Matrix3.fromQuaternion(_RotateQ, _RotateM)
            Matrix3.multiplyByVector(
              _RotateM,
              _scratchCartesian3Normal1,
              _scratchCartesian3Normal1
            )
            Cartesian3.normalize(
              _scratchCartesian3Normal1,
              _scratchCartesian3Normal1
            )
            return _scratchCartesian3Normal1
          },
          u_radius: radius,
          u_scanColor: Color.fromCssColorString(color)
        }
      })

      window.viewer.scene.postProcessStages.add(_delegate)

      return _delegate
    }
  }

function transformCartesianToWGS84(cartesian) {
    if (cartesian) {
      var ellipsoid = Ellipsoid.WGS84
      var cartographic = ellipsoid.cartesianToCartographic(cartesian)
      return {
        lng: CMath.toDegrees(cartographic.longitude),
        lat: CMath.toDegrees(cartographic.latitude),
        alt: cartographic.height
      }
    }
  }
function _getRadarScanShader(options) {
    if (options && options.get) {
      return 'uniform sampler2D colorTexture;\n\
              uniform sampler2D depthTexture;\n\
              in vec2 v_textureCoordinates;\n\
              uniform vec4 u_scanCenterEC;\n\
              uniform vec3 u_scanPlaneNormalEC;\n\
              uniform vec3 u_scanLineNormalEC;\n\
              out vec4 myOutputColor;\n\
              uniform float u_radius;\n\
              uniform vec4 u_scanColor;\n\
              \n\
              vec4 toEye(in vec2 uv, in float depth){\n\
              vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n\
              vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n\
              posInCamera =posInCamera / posInCamera.w;\n\
              return posInCamera;\n\
              }\n\
              \n\
              bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt){\n\
              vec3 v01 = testPt - ptOnLine;\n\
              normalize(v01);\n\
              vec3 temp = cross(v01, lineNormal);\n\
              float d = dot(temp, u_scanPlaneNormalEC);\n\
              return d > 0.5;\n\
              }\n\
              \n\
              vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){\n\
              vec3 v01 = point -planeOrigin;\n\
              float d = dot(planeNormal, v01) ;\n\
              return (point - planeNormal * d);\n\
              }\n\
              \n\
              float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt){\n\
              vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n\
              return length(tempPt - ptOnLine);\n\
              }\n\
              \n\
              float getDepth(in vec4 depth){\n\
              float z_window = czm_unpackDepth(depth);\n\
              z_window = czm_reverseLogDepth(z_window);\n\
              float n_range = czm_depthRange.near;\n\
              float f_range = czm_depthRange.far;\n\
              return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n\
              }\n\
              \n\
              void main(){\n\
              myOutputColor = texture(colorTexture, v_textureCoordinates);\n\
              float depth = getDepth( texture(depthTexture, v_textureCoordinates));\n\
              vec4 viewPos = toEye(v_textureCoordinates, depth);\n\
              vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n\
              float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n\
              float twou_radius = u_radius * 2.0;\n\
              if(dis < u_radius){\n\
                  float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n\
                  f0 = pow(f0, 64.0);\n\
                  vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n\
                  float f = 0.0;\n\
                  if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz)){\n\
                      float dis1= length(prjOnPlane.xyz - lineEndPt);\n\
                      f = abs(twou_radius -dis1) / twou_radius;\n\
                      f = pow(f, float(' + options.width + '));\n\
                  }\n\
                  if(float(' + options.border + ') > 0.0){\n\
                    myOutputColor = mix(myOutputColor, u_scanColor, f + f0);\n\
                  } else {\n\
                    myOutputColor = mix(myOutputColor, u_scanColor, f);\n\
                  }\n\
                  }\n\
              }\n\
              '
    }
  }