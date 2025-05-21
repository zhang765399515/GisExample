import { PostProcessStage, PostProcessStageCollection, PostProcessStageComposite } from 'geokey-gis';

let collection: PostProcessStageCollection | undefined= undefined;
let lightning: PostProcessStage | PostProcessStageComposite | undefined = undefined;
const lightningShaderSource=`
    uniform sampler2D colorTexture; //输入的场景渲染照片
    varying vec2 v_textureCoordinates;
    float hash(float x){return fract(21654.6512 * sin(385.51 * x));}
    float hash(vec2 p){return fract(1654.65157 * sin(15.5134763 * p.x + 45.5173247 * p.y+ 5.21789));}
    vec2 hash2(vec2 p){return vec2(hash(p*.754),hash(1.5743*p+4.5476351));}
    vec2 add = vec2(1.0, 0.0);
    vec2 noise2(vec2 x){vec2 p = floor(x);vec2 f = fract(x);f = f*f*(3.0-2.0*f);vec2 res = mix(mix( hash2(p), hash2(p + add.xy),f.x),mix( hash2(p + add.yx), hash2(p + add.xx),f.x),f.y);return res;}
    vec2 fbm2(vec2 x){vec2 r = vec2(0.0);float a = 1.0;for (int i = 0; i < 8; i++){r += noise2(x) * a;x *= 2.;a *= .5;}return r;}
    float dseg( vec2 ba, vec2 pa ){float h = clamp( dot(pa,ba)/dot(ba,ba), -0.2, 1. );return length( pa - ba*h );}
    void main(void)
    {
        vec2 iResolution = czm_viewport.zw;
        float iTime = czm_frameNumber * 10.0 / 1000.0;
        vec2 p=2.*gl_FragCoord.xy/iResolution.yy-1.;
        vec2 d;
        vec2 tgt=vec2(1.,-1.);
        float c=0.;
        if(p.y>=0.)
        c=(1.-(fbm2((p+.2)*p.y+.1*iTime)).x)*p.y;
        else
        c=(1.-(fbm2(p+.2+.1*iTime)).x)*p.y*p.y;
        vec3 col=vec3(0.),col1=c*vec3(.3,.5,1.);
        float mdist=100000.;

        float t=hash(floor(5.*iTime));
        tgt+=4.*hash2(tgt+t)-1.5;
        if(hash(t+2.3)>.6)
        for(int i=0;i<100;i++){

        vec2 dtgt=tgt-p;
        d=.05*(vec2(-.5,-1.)+hash2(vec2(float(i),t)));
        float dist=dseg(d,dtgt);
        mdist=min(mdist,dist);
        tgt-=d;
        c=exp(-.5*dist)+exp(-55.*mdist);
        col=c*vec3(.7,.8,1.);
        }
        col+=col1;
        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(col,0.), 0.5); //将雨和三维场景融合
    }
`
export function addLightning() {
    collection = window.viewer.scene.postProcessStages;
    lightning = new PostProcessStage({
        name: 'czm_lightning',
        fragmentShader: lightningShaderSource
    });;
    collection.add(lightning);
}
//移除
export function removeLightning() {
    if (collection && lightning) {
        collection.remove(lightning);
    }
}