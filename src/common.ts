import { ObservablePoint, PointData } from "pixi.js";

export interface IGameRenderer {
    onEnterRenderCycle: Function;
    displayEntities: Function;
};

export interface IGlobalPosition extends PointData {};

export interface IFieldPosition extends PointData {};

export enum IGridCellType {
    EMPTY = 0,
    DUDE = 1,
    OBSTACLE = 5,
    MINION = 7,
    MINION_LAZY = 8,
    EXIT = 9,
};

export enum WarningType {
    LOCATION_UNAVAILABLE = 'location_unavailable',
};

export enum DynamicGameObjectState {
    PENDING = 101,
    MOVING = 102,
    FRUSTRATING = 110,
}

export abstract class GameConfig {
    FIELD_WIDTH: number;
    FIELD_HEIGHT: number;
    CELL_SIZE: number;
    FRAME_INTERVAL: number;
    CANVAS: HTMLCanvasElement;
    COLORS: any;
    OBSTACLES: any;
    ENDPOINT: any;
    EXIT: any;
    DUDE: any;
    MINION: any;
    DIALOG: any;
    SCORE: any;
    ALL_TEXTURES: Array<any>;

    updateSize: any;
}