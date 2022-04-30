import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Conf } from '../core/conf';
import { Color } from "three/src/math/Color";
import { Item } from './item';
import { Util } from '../libs/util';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Param } from '../core/param';


export class Con extends Canvas {

  private _con: Object3D;
  private _item:Array<Item> = []
  private _colors:Array<Color> = []
  private _font:any;

  constructor(opt: any) {
    super(opt);

    this._makeColors();
    this._makeColors();
    this._makeColors();
    this._makeColors();
    this._makeColors();

    this._con = new Object3D()
    this.mainScene.add(this._con)

    const loader = new FontLoader();
    loader.load('./assets/helvetiker_bold.typeface.json', (e) => {
      console.log(e);
      this._font = e;

      const baseText = Conf.instance.TEXT.split('');

      for(let i = 0; i < baseText.length; i++) {
        const item = new Item({
          id:i,
          text:baseText[i],
          font:this._font,
          colorA:Util.instance.randomArr(this._colors),
          colorB:Util.instance.randomArr(this._colors),
        });
        this._con.add(item);
        this._item.push(item);
      }
    })

    this._resize()
  }


  protected _update(): void {
    super._update();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this._item.forEach((val2) => {
      val2.visible = false;
    })

    let selectedTxt = Param.instance.selectedText;
    const selectedTxtArr = selectedTxt.split('');
    selectedTxtArr.forEach((val) => {
      this._item.forEach((val2) => {
        if(val2.visible == false) val2.visible = (val2.text == val);
      })
    })

    const showItemNum = selectedTxtArr.length;
    const radius = Math.min(w, h) * 0.5;
    const dist = (radius * 2) * Math.PI;
    // const size = (dist / Conf.instance.TEXT.length) * 0.8;
    const size = (dist / Math.max(10, showItemNum)) * 0.8;
    let key = 0;

    this._item.forEach((val2) => {
      if(val2.visible) {
        val2.updateMesh({
          size:size,
        })

        const radian = Util.instance.radian(this._c * 0.5 + (360 / showItemNum) * key);
        val2.position.x = Math.sin(radian) * radius;
        val2.position.z = Math.cos(radian) * radius;

        const ang = Util.instance.degree(Math.atan2(val2.position.x, val2.position.z));
        val2.rotation.y = Util.instance.radian(ang + 180);

        key++;
      }
    })

    // this._con.rotation.z = Util.instance.radian(45);
    this._con.rotation.z += 0.01;


    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 1)
    this.renderer.render(this.mainScene, this.camera)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this.updateCamera(this.camera, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }


  // ------------------------------------
  // 使用カラー作成
  // ------------------------------------
  private _makeColors():void {
    // this._colors = []

    const colA = new Color(Util.instance.random(0, 1), Util.instance.random(0, 1), Util.instance.random(0, 1))
    const colB = new Color(1 - colA.r, 1 - colA.g, 1 - colA.b)

    const hslA = { h: 0, s: 0, l: 0 }
    colA.getHSL(hslA)

    const hslB = { h: 0, s: 0, l: 0 }
    colB.getHSL(hslB)

    const r = 0.2
    for(let i = 0; i < 1; i++) {
      const hslA = { h: 0, s: 0, l: 0 }
      colA.getHSL(hslA)
      hslA.s += Util.instance.range(r)
      hslA.l += Util.instance.range(r)

      const hslB = { h: 0, s: 0, l: 0 }
      colB.getHSL(hslB)
      hslB.s += Util.instance.range(r)
      hslB.l += Util.instance.range(r)

      const colC = new Color()
      colC.setHSL(hslA.h, hslA.s, hslA.l)
      this._colors.push(colC)

      const colD = new Color()
      colD.setHSL(hslB.h, hslB.s, hslB.l)
      this._colors.push(colD)
    }
  }
}
