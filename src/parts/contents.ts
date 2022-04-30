
import { Con } from "../con/con";
import { Conf } from "../core/conf";
import { Func } from "../core/func";
import { MyDisplay } from "../core/myDisplay";
import { Param } from "../core/param";
import { Tween } from "../core/tween";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _txt:HTMLElement;

  constructor(opt:any) {
    super(opt)

    this._txt = document.querySelector('.l-main p') as HTMLElement;
    this._txt.innerHTML = Conf.instance.TEXT;

    new Con({
      el:document.querySelector('.l-canvas')
    });
  }


  protected _update(): void {
    super._update();

    Tween.instance.set(this.getEl(), {
      height:Func.instance.sh()
    })

    const t = window.getSelection()?.toString() || '';
    Param.instance.selectedText = t;

    Param.instance.debug.innerHTML = t;
  }
}