import { Sprite, Text, TextStyle } from "pixi.js";
import { GameConfig } from "../../config/Config";
import { getPriceText } from "../../utils/Utils";

export class Score extends Sprite {

    private amount: number = 5;
    private textAmount: Text;
    private textCurrency: Text;

    public getAmount = (): number => {
        return this.amount;
    }

    public adjustAmount = (value: number) => {
        this.amount += value;
        this.textAmount.text = String(this.amount);
        this.textCurrency.text = getPriceText(this.amount);
    }

    constructor(texture: any) {
        super(texture);

        this.position = { x: 0, y: GameConfig.FIELD_HEIGHT * GameConfig.CELL_SIZE };

        const styleAmountOptions: any = {
            align: "center",
            dropShadow: {
                alpha: 0.5,         // 50% opacity shadow
                angle: Math.PI / 6, // 30 degrees
                blur: 1,            // Soft shadow edge
                color: '#000000',   // Black shadow
                distance: 6         // Shadow offset
            },
            fill: "#ff0000",
            fontFamily: "Impact",
            fontSize: 64,
            fontWeight: "bold"
        };
        const styleCurrencyOptions = { ...styleAmountOptions, ...{ fontSize: 28, fontWeight: 100 } };

        this.textAmount = new Text();
        this.textAmount.position.set(this.width / 2 - styleAmountOptions.fontSize * 1.5, this.height / 1.5);
        this.textAmount.style = new TextStyle(styleAmountOptions);//style;
        this.textAmount.text = this.amount;
        this.addChild(this.textAmount);

        this.textCurrency = new Text();
        this.textCurrency.position.set(this.width / 2 + styleCurrencyOptions.fontWeight / 2, this.height / 2 + styleCurrencyOptions.fontWeight * 1.2);
        this.textCurrency.style = new TextStyle(styleCurrencyOptions);//style;
        this.textCurrency.text = 'гривень';
        this.textCurrency.pivot.x = styleCurrencyOptions.fontWeight / 2;
        this.textCurrency.pivot.y = styleCurrencyOptions.fontWeight / 2;
        this.addChild(this.textCurrency);

        this.pivot.set(0, this.height);
        this.scale.set((GameConfig.FIELD_WIDTH * GameConfig.CELL_SIZE) / this.width, 1)
    }


}