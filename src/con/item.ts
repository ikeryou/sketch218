import vs from '../glsl/simple.vert';
import fs from '../glsl/item.frag';
import { MyObject3D } from "../webgl/myObject3D";
import { Mesh } from 'three/src/objects/Mesh';
import { DoubleSide } from 'three/src/constants';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Color } from 'three/src/math/Color';

export class Item extends MyObject3D {

  private _mesh:Mesh | undefined;

  private _text:string = '';
  public get text():string {
    return this._text;
  }

  private _centerOffset:number = 0;

  constructor(opt:any = {}) {
    super()

    this._text = opt.text

    const textGeo:TextGeometry = new TextGeometry(this._text, {
      font: opt.font,
      size: 1,
      height: 0.25,
      curveSegments: 32,
      bevelThickness: 0,
      bevelSize: 0  ,
      bevelEnabled: true
    });
    textGeo.computeBoundingBox();

    if(textGeo.boundingBox != null) {
      this._centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

      this._mesh = new Mesh(
        textGeo,
        new ShaderMaterial({
          vertexShader:vs,
          fragmentShader:fs,
          transparent:true,
          side:DoubleSide,
          depthTest:false,
          uniforms:{
            alpha:{value:1},
            color:{value:new Color(opt.colorA)},
            addColRate:{value:0},
            addCol:{value:new Color(opt.colorB)},
          }
        })
      );
      this.add(this._mesh);
    }

  }


  public updateMesh(opt:any):void {
    const s = opt.size;
    this.scale.set(s, s, s);

    if(this._mesh != undefined) {
      this._mesh.position.y = -0.5
    }
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    if(this._mesh != undefined) {
      this._mesh.position.x = this._centerOffset;
    }
  }
}