import { Sprite, Container, Texture, Ticker, Rectangle, ParticleContainer, Particle } from "pixi.js";
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

    /*
    private createContinuousVortex = (texture: Texture): ParticleContainer => {
        //   const props = new ParticleContainerOptions();
        const container = new ParticleContainer({
            // this is the default, but we show it here for clarity
            dynamicProperties: {
                position: true, // Allow dynamic position changes (default)
                scale: false, // Static scale for extra performance
                rotation: false, // Static rotation
                color: false, // Static color
            },
        });

        const particles: Array<{ particle: Particle, startTime: number }> = [];
        const startTime = performance.now();

        for (let i = 0; i < 115; i++) {
            const particle = new Particle({
                texture,
                x: 0,
                y: 0
            });
            particle.anchorX = particle.anchorY = 0.5;
            particle.alpha = 0;
            
          //  sprite.anchor.set(0.5);
           // sprite.alpha = 0;
           // container.addChild(sprite);

           //const particle = {
           //     sprite: sprite,
          //      startTime: startTime + i * 200
          //  };

            particles.push({ particle, startTime: startTime + i * 200 });
            container.addParticle(particle);
        }

        const animate = () => {
            const currentTime = performance.now();

            particles.forEach(({ particle, startTime }, index) => {
                const elapsed = (currentTime - startTime) * 0.001;
                const lifePhase = (elapsed % 4) / 4;

                if (lifePhase < 0.25) {
                    particle.alpha = lifePhase * 4;
                } else if (lifePhase > 0.75) {
                    particle.alpha = (1 - lifePhase) * 4;
                } else {
                    particle.alpha = 1;
                }

                const angle = elapsed * 2 + (index / 15) * Math.PI * 2;
                const radius = 50 * (1 - lifePhase);

                particle.x = Math.cos(angle) * radius;
                particle.y = Math.sin(angle) * radius;
                particle.rotation = angle;
                particle.scaleX = particle.scaleY = (0.3 + lifePhase * 0.4);
            });

        };

        Ticker.shared.add(animate);
        return container;
    }*/
}