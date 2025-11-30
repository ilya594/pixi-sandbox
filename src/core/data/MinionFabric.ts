import { Assets } from "pixi.js";
import { Minion } from "../view/components/Minion";
import { GameConfig } from "../config/Config";
import { IGridCellType } from "../../common";
import { FieldUtils } from "../utils/FieldUtils";
import { getRandomWithin, P } from "../utils/Utils";
import GameObjects from "./GameObjects";
import { ObjectPosition } from "../view/ObjectPosition";

export class MinionFabric {
    public static getMinionByPosition = (position: ObjectPosition): Minion =>  {
        return GameObjects.minions.find((minion: Minion) => minion.location.equals(position));
    }

    private fieldData: FieldUtils;

    constructor(fieldData: FieldUtils) {
        this.fieldData = fieldData;
    }

    public getMinion = (): Minion => {
        const random: number = getRandomWithin(GameConfig.MINION.TEXTURES.length - 1, 1);      
        return (random > 1) ? new Minion(Assets.get('animal_00' + random)) : new Minion(Assets.get('animal_001'));
    }

    public getMinions = (): Array<Minion> => {
        const positions: Array<ObjectPosition> = this.fieldData.getTypedFieldPositions(IGridCellType.MINION);
        return positions.map((location: ObjectPosition) => {
            const minion: Minion = this.getMinion();
            minion.location = location;
            this.fieldData.positionGrid.updateObjectPosition(minion, location);
            return minion;
        });
    }
}