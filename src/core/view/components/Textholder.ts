import { Sprite, Text } from "pixi.js";
import { GameConfig } from "../../config/Config";
import { getPriceText } from "../../utils/Utils";

export class Textholder extends Sprite {

    private text: Text;

    constructor(texture: any) {
        super(texture);
        this.visible = false;
        this.scale.x = 0.4;
        this.scale.y = 0.4;
        this.pivot.x = -GameConfig.CELL_SIZE;
        this.pivot.y = (GameConfig.CELL_SIZE * 2 + this.height * 2);
        this.text = new Text();
        this.text.x = GameConfig.CELL_SIZE * 2;
        this.text.y = GameConfig.CELL_SIZE * 1.5;
        this.addChild(this.text);
        
    }

    public showText = (object: any, text: string = undefined) => {
        this.visible = true;
        this.position.x = object.position.x;
        this.position.y = object.position.y;
        const amount: number = object.getPrice?.();
        this.text.text = (typeof text === 'undefined') ? 
        GameConfig.SCORE.PHRASE_OVERTURE + amount + '\n' + getPriceText(amount) + GameConfig.SCORE.PHRASE_FINALE : text;      
    }

    public hide = () => {
        this.visible = false;
    }
}