import { Color, Cartesian3, Primitive, Material, GeometryInstance, EllipsoidGeometry, CircleGeometry, MaterialAppearance } from "geokey-gis";

export function lightPoint(options: any) {
  const { elevation, strength, distance, lightColor } = options;
  const position1 = Cartesian3.fromDegrees(112.1545612, 25.1564512354, 4000);
  const position2 = Cartesian3.fromDegrees(112.1545612, 25.1564512354, 6000);
  const position3 = Cartesian3.fromDegrees(112.1545612, 25.1564512354, 8000);
  const glowPointMaterial = new Material({
    fabric: {
      type: 'glowPointMaterial',
      uniforms: {
        cameraWC: window.viewer.scene.camera.positionWC,
        position1,
        position2,
        position3,
        distance: 500,
        strength: 10,
        lightColor1: Color.RED,
        lightColor2: Color.GREEN,
        lightColor3: Color.BLUE,
        glowPower: 0.25,
        taperPower: 1.0
      },
      source: `
        float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
          #if defined ( LEGACY_LIGHTS )
            if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
              return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
            }
            return 1.0;
          #else
            float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
            if ( cutoffDistance > 0.0 ) {
              distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
            }
            return distanceFalloff;
          #endif
        }


        struct PointLight {
          vec3 position;
          vec3 color;
          float distance;
          float decay;
        };
        uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

        void getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {
          vec3 lVector = pointLight.position - geometry.position;
          light.direction = normalize( lVector );
          float lightDistance = length( lVector );
          light.color = pointLight.color;
          light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
          light.visible = ( light.color != vec3( 0.0 ) );
        }

        vec3 positionEC;
        // vec3 positionWC;
        vec3 normalEC;
        vec4 makeLight(vec4 lightColorHdr,vec3 lightPos, vec3 positionWC,vec3 positionEC,vec3 normalEC,czm_pbrParameters pbrParameters){
          vec3 color = vec3(0.0);
          float mx1 = 1.0;
          vec3 light1Dir = positionWC - lightPos;
          float distance1 = length(light1Dir);
          if(distance1 < 1000.0){
            vec4 l1 = czm_view * vec4(lightPos, 1.0);
            vec3 lightDirectionEC = l1.xyz - positionEC;
            mx1 = 1.0 - distance1 / 1000.0;
            color = czm_pbrLighting(
              positionEC,
              normalEC,
              lightDirectionEC,
              lightColorHdr.xyz,
              pbrParameters
            ).xyz;
          }
          mx1 = max(color.r,max(color.g,color.b)) * pow(mx1,1.0) * 1.0;
          return vec4(color,mx1);
        }

        czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            material.diffuse = vec3(1.0);
            
            vec3 lightColorHdr = czm_lightColorHdr;
            vec3 lightDirectionEC = czm_lightDirectionEC;
            lightDirectionEC = (czm_view * vec4(cameraWC,1.0)).xyz - positionEC;
            
            czm_pbrParameters pbrParameters;
            pbrParameters.diffuseColor = material.diffuse;
            pbrParameters.f0 = vec3(0.04);
            pbrParameters.roughness = 1.0;
            
            vec3 ligth1Color0 = czm_pbrLighting(
                positionEC,
                normalEC,
                lightDirectionEC,
                lightColorHdr,
                pbrParameters
            );
            
            vec4 ligth1ColorR = makeLight(lightColor1, position1, positionWC, positionEC, normalEC, pbrParameters);
            
            vec3 finalColor = mix(ligth1Color0.rgb, ligth1ColorR.rgb, ligth1ColorR.a);
            material.shininess = 1.0;
            material.diffuse = ligth1Color0;
            return material;
        }
      `
    }
  });

  //创建wall墙体
  const glowPoint = new Primitive({
    geometryInstances: new GeometryInstance({
      geometry: new CircleGeometry({
        center: position1,
        radius: 20,
        height: 500
      })
    }),
    appearance: new MaterialAppearance({
      material: glowPointMaterial
    })
  });

  //添加箭头效果立体墙
  window.viewer.scene.primitives.add(glowPoint);

  window.viewer.goTo({
    center: [112.1545612, 25.1564512354, 2000]
  });
}
