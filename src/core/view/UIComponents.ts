//@ts-nocheck
import { WarningType } from "../../common";

export class UIComponents {
    
    private interval: any;
    private container: HTMLElement | any;
    private graphics: HTMLCanvasElement;

    constructor() {
        this.graphics = document.createElement("canvas");
        this.graphics.style.display = 'none';
        this.graphics.id = 'canvas2d';
        document.body.appendChild(this.graphics);

        document.onmousemove = (event: MouseEvent) => this.matrixEffect(true);
    }

    public showWarning = (type: WarningType) => {      
        //TODO ....
    }

    public matrixEffect = (off: boolean = false) => {
        if (off) { document.getElementById('canvas')?.style.display = 'block'; const canvas = document.getElementById('canvas2d') as HTMLCanvasElement;
        canvas?.style?.display = 'none'; document.getElementById('canvas2d')?.parentNode?.removeChild(document.getElementById('canvas2d'));
        document.onmousemove = () => {}; return null; } else document.getElementById('canvas')?.style?.display = 'none';
        const canvas = document.getElementById('canvas2d') as HTMLCanvasElement;
        canvas?.style?.display = 'block'; const _0x12ef = canvas['getContext']('2d', { 'willReadFrequently': !![] });
        const _0x2b8a7d = (canvas['width'] = window['innerWidth']); const _0x5c6b2e = (canvas['height'] = window['innerHeight']);
        const _0x3d4a = ['А+Б0ƓВڲ-Г1Д=Е2Ё Ж3З И4Йۺ К5Лإ М6Нڧ О7П ۴ڟ Ф!ڮХ ЦÛ?Ч ƪШ.іагb н ьцск бйщцгу ритй',
        'шлщшб пр,Ы Ь:ЭЮ;ڿڿڦЯ 开儿 艾  诶Ƣ 开伊 艾2 艾ƕڪ   西Ý 吉 3艾 %$艾 伊4 ¿ 67 娜% ڠ伊',
        '6a bcƜ dٿefïo#pؠ-qrstu &v* ڜ wxy3z ¼ ¾ æè ƩỺ ʭʩʥ˩˩ͼ  ͽͽΔΘƿαΦњҭΔΔΔω ϘϠ ϠϡϢϧ Ϩ ϬϬϪЉЊ',
        '1871640532 1 udp 1677729535 188.212777 typ srflx raddr 0.0.0.0 rport 0 generation 0',
        'ufrag AfOL network-coe:83249ጎ൦ξГஊҹꤚ8458 1 udp 1677729535 4147.105 55549 typ srflx',
        ' raddr 0.0.0.0 rport 0 generationf 0 ufrag 4W3O ne ϲτ χ κ ͷρ φ \tπ314 ʏ ƙ ɜ ӆ ϰ ƴ',
        'и̷ ய ౦ ӥ ❡ ㄐ и̷ௐ ჯ ய౦? ቀ \tჶ ෲ? ƿ ᗱ ЯςԽҨᖗᓕ𞊝Π𖭦ҋ𓁃זㄏ ㄨ ȹ Ⴏ ȝ Κ Ͷ Λ  Ο Φ Η БΛЯΤЬ ❞૱ઐᙓዘҚ☯',
        ' нaχƴй ㄨㄦ੦ഠ〇ㄇㄐ૯ㄏㄏ πiȝgyютьㄇㄈ ㄋ ㄏ ㄐ ㄒ\tㄗ ㄙ ㄚ\t ㄤ ㄥ ㄦ ㄨ ㄩ\t4TG',
        'split', 'fillStyle', 'rgba(0,0,0,.05)', 'fillRect','#00ff00', 'random', '#f00',
        'font', 'px system-ui', 'length', 'floor', 'fillText' ];
        (function (_0x4f3c2e, _0x3d4a5b) { const _0x4c8d18 = function (_0x1f8a7d) { while (--_0x1f8a7d) {
        _0x4f3c2e['push'](_0x4f3c2e['shift']()); } }; _0x4c8d18(++_0x3d4a5b); }(_0x3d4a, 0x1f4));
        const _0x4c8d = function (_0x4f3c2e, _0x3d4a5b) { _0x4f3c2e = _0x4f3c2e - 0x0; let _0x4c8d18 = _0x3d4a[_0x4f3c2e]; return _0x4c8d18; };
        const _0x1a9c3b = _0x4c8d('0x0') + _0x4c8d('0x1') + _0x4c8d('0x2') 
        + _0x4c8d('0x3') + _0x4c8d('0x4') + _0x4c8d('0x5') + _0x4c8d('0x6') + _0x4c8d('0x7');
        const _0x3e5f82 = _0x1a9c3b[_0x4c8d('0x8')](''); const _0x2e5c94 = _0x2b8a7d / 24;
        let _0x5a12b6 = []; for (let _0x3a8d1f = 0x0; _0x3a8d1f < _0x2e5c94; _0x3a8d1f++) _0x5a12b6[_0x3a8d1f] = 0x1;
        const _0x3f7a8c = () => { _0x12ef[_0x4c8d('0x9')] = _0x4c8d('0xa'); _0x12ef[_0x4c8d('0xb')](0x0, 0x0, _0x2b8a7d, _0x5c6b2e);
        _0x12ef[_0x4c8d('0x9')] = _0x4c8d('0xc'); if (Math[_0x4c8d('0xd')]() > 0.9955) _0x12ef[_0x4c8d('0x9')] = _0x4c8d('0xe');
        _0x12ef[_0x4c8d('0xf')] = 24 + _0x4c8d('0x10'); for (let _0x3a8d1f = 0x0; _0x3a8d1f < _0x5a12b6[_0x4c8d('0x11')]; _0x3a8d1f++) {
        const _0x1d07b8 = _0x3e5f82[Math[_0x4c8d('0x12')](Math[_0x4c8d('0xd')]() * _0x3e5f82[_0x4c8d('0x11')])];
        _0x12ef[_0x4c8d('0x13')](_0x1d07b8, _0x3a8d1f * 24, _0x5a12b6[_0x3a8d1f] * 24);
        if (_0x5a12b6[_0x3a8d1f] * 24 > _0x5c6b2e && Math[_0x4c8d('0xd')]() > (Math.E-Math.LN10)*2) _0x5a12b6[_0x3a8d1f] = 0x0;
        _0x5a12b6[_0x3a8d1f]++; } }; this['interval'] = setInterval(_0x3f7a8c, Math['pow'](Math['PI'], Math['PI']));
    }
}

export default new UIComponents();