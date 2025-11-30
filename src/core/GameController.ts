import { Assets } from "pixi.js";
import { IGridCellType, IGameRenderer, IGlobalPosition } from "../common";
import { GameConfig } from "./config/Config";
import UIComponents from "./view/UIComponents";
import { Dude } from "./view/components/Dude";
import { Pointer } from "./view/components/Pointer";
import { Field } from "./view/components/Field";
import GameEvents from "./data/GameEvents";
import { FieldUtils } from "./utils/FieldUtils";
import { MinionFabric } from "./data/MinionFabric";
import { P } from "./utils/Utils";
import { WarningType } from "../common";
import WebGLRenderer from "./view/WebGLRenderer";
import { Minion } from "./view/components/Minion";
import GameObjects from "./data/GameObjects";
import { Textholder } from "./view/components/Textholder";
import { Exit } from "./view/components/Exit";
import { DynamicGameObject } from "./view/DynamicGameObject";
import { Score } from "./view/components/Score";
import { ObjectPosition } from "./view/ObjectPosition";

export class GameController {
    private renderer: IGameRenderer;
    private fieldUtils: FieldUtils;

    constructor() {
        this.initialize();
    }

    private initialize = async () => {
        UIComponents.matrixEffect();
        this.renderer = await WebGLRenderer.initialize();
        this.fieldUtils = new FieldUtils();
        this.initializeEntities();
        this.renderer.displayEntities();
        this.fieldUtils.initialize();
        GameEvents.addEventListener(GameEvents.GAMEFIELD_POINTER_DOWN_EVENT, this.onFieldPointerDown);
        GameEvents.addEventListener(GameEvents.GAMEOBJECT_AROUND_POSITION_SPOTTED, this.onObjectsEngaged);
        GameEvents.addEventListener(GameEvents.GAMEOBJECT_REACHED_EXIT_EVENT, this.onObjectExiting);
    }

    private initializeEntities = () => {
        GameObjects.exit = new Exit(Assets.get(GameConfig.EXIT.TEXTURE_DEFAULT), this.fieldUtils.getFirstTypedPosition(IGridCellType.EXIT));
        GameObjects.dude = new Dude(Assets.get(GameConfig.DUDE.TEXTURE_DEFAULT), ObjectPosition.fromField(0, 0));        
        GameObjects.minions = (new MinionFabric(this.fieldUtils)).getMinions();
        GameObjects.pointer = new Pointer(Assets.get(GameConfig.ENDPOINT.TEXTURE_DEFAULT));
        GameObjects.field = new Field(this.fieldUtils);
        GameObjects.dialog = new Textholder(Assets.get(GameConfig.DIALOG.TEXTURE_DEFAULT));
        GameObjects.score = new Score(Assets.get(GameConfig.SCORE.TEXTURE_DEFAULT));
    }

    private onFieldPointerDown = (event: any): void => {
        GameObjects.pointer.place({ x: event.x, y: event.y });

        const newPosition: ObjectPosition = P({ x: event.x, y: event.y });
        const currentPosition: ObjectPosition = GameObjects.dude.location;

        const path: Array<IGlobalPosition> = this.fieldUtils.findPath(currentPosition, newPosition);

        path ? GameObjects.dude.setPath(path) : UIComponents.showWarning(WarningType.LOCATION_UNAVAILABLE);
    }

    private onObjectsEngaged = (objects: Array<DynamicGameObject>): void => {
        const path: Array<IGlobalPosition> = GameObjects.dude.getPath();
        const target = path.length ? path.pop() : GameObjects.dude.getTarget();     

        const targetPosition = this.fieldUtils.positionGrid.getPositionFromPixels(target.x, target.y);
        if (!targetPosition) return;

        const positions: Array<ObjectPosition> = this.fieldUtils.getPositionsListAround(targetPosition, IGridCellType.EMPTY, 5);
      
        objects.forEach((minion: Minion) => {
            if (GameObjects.dude.addToGroup(minion)) {
                const minionPosition = this.fieldUtils.positionGrid.findObjectPosition(minion.uuid);
                if (minionPosition) {
                    minion.setPath(this.fieldUtils.findPath(minionPosition, targetPosition));
                }
            }
        });

        GameObjects.minions.forEach((minion: Minion) => {
            if (minion.engaged) {
                const emptySpot = positions.shift();
                if (emptySpot) {
                 //   minion.appendPath([emptySpot.toGlobalCoords()]);
                }
            }
        });
    }

    private onObjectExiting = (object: Minion) => {
        GameObjects.score.adjustAmount(object.getPrice());
        GameObjects.minions.splice(GameObjects.minions.findIndex(({ uuid }) => object.uuid === uuid), 1)
            && GameObjects.dude.removeFromGroup(object) && object.destroyObject() && WebGLRenderer.removeEntities([object]);
    }
}

export default GameController;