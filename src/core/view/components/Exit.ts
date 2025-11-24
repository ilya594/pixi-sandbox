import { Sprite, Container, Texture, Ticker, Rectangle } from "pixi.js";
import { IGlobalPosition } from "../../../common";
import { GameConfig } from "../../config/Config";

export class Exit extends Sprite {

    constructor(texture: any, position: IGlobalPosition = null) {
        super();
        if (position) {
            this.position.set(position.x - GameConfig.CELL_SIZE / 2, position.y);
        }
        this.scale.set(1, 0.5);
        this.eventMode = 'static';
        this.hitArea = new Rectangle(this.x, this.y, texture.width, texture.height / 2);
        this.addChild(this.createParticleVortex(texture));
    }

/**
 *  Method kindly provided by AI :)
 */
    private createParticleVortex = (texture: Texture): Container => {

        const container = new Container();

        const layers: Array<any> = [];
        for (let i = 0; i < 3; i++) {
            const sprite = new Sprite(texture);
            sprite.anchor.set(0.5);
            sprite.alpha = 0.6 - i * 0.2;
            sprite.scale.set(1 - i * 0.3);
            container.addChild(sprite);
            layers.push(sprite);
        }

        let time = 0;
        const animate = () => {
            time += 0.01;
            layers.forEach((layer, index) => {
                layer.rotation += 0.02 * (index + 1);
                const scale = 0.8 + Math.sin(time + index) * 0.2;
                layer.scale.set(scale);
                const spiralSpeed = 0.02 * (index + 1);
                layer.x = Math.cos(time * spiralSpeed) * (10 + index * 5);
                layer.y = Math.sin(time * spiralSpeed) * (10 + index * 5);
            });
        };
        Ticker.shared.add(animate);
        return container;
    }
}