import { IFieldPosition } from "../../common";
import { GameConfig } from "../config/Config";

interface IRendererConfig {
    FIELD_WIDTH: number;
    FIELD_HEIGHT: number;
    FRAME_INTERVAL: number;
    CANVAS: HTMLCanvasElement;
    CELL_SIZE: number;
    COLORS: {
        MINION: string;
        DUDE: string;
        GRID: string;
        BACKGROUND: string;
        PATH: string;
        TARGET: string;
        TEXT: string;
    };
}

class CanvasRenderer {

    private config: IRendererConfig;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private cache: any = {
        background: null,
    };

    constructor(config: IRendererConfig = null) {

        this.config = config || GameConfig;

        this.initialize();

        this.renderBackground();
        this.renderFieldGrid();
    }

    private initialize = (): void => {
        
        if (this.config.CANVAS instanceof HTMLCanvasElement === false) {
            this.config.CANVAS = document.getElementById("canvas") as HTMLCanvasElement;
        }
        this.canvas = this.config.CANVAS;
        this.context = this.canvas.getContext('2d', { willReadFrequently: true });

        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;

      //  recalculateFieldSize(5,5);
        
        this.context.scale(dpr, dpr);
        this.context.imageSmoothingEnabled = false;

        this.canvas.addEventListener('click', this.handleCanvasClick);
    }

    private handleCanvasClick = (event: MouseEvent): void => {

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
     //   const tilePosition = ;
        
        this.renderTargetLocation(this.pixelsToPosition(x, y));
    
    }

    private renderTargetLocation = (position: IFieldPosition): void => {
       
        const { x, y } = this.positionToPixels(position);
        const centerX = x + this.config.CELL_SIZE / 2;
        const centerY = y + this.config.CELL_SIZE / 2;
            this.context.fillStyle = this.config.COLORS.TARGET;
            this.context.lineWidth = 3;            
            this.context.beginPath();
            this.context.arc(centerX, centerY, this.config.CELL_SIZE/ Math.PI, 0, 2 * Math.PI);
            this.context.fill();
    }

    private pixelsToPosition = (x: number, y: number): IFieldPosition => {
        return {
            x: Math.floor(x / this.config.CELL_SIZE),
            y: Math.floor(y / this.config.CELL_SIZE)
        };
    }

    private positionToPixels = (position: IFieldPosition): { x: number; y: number } => {
        return {
            x: position.x * this.config.CELL_SIZE,
            y: position.y * this.config.CELL_SIZE
        };
    }

    public renderBackground = (): void => {
        if (this.cache.background) {
            this.context.putImageData(this.cache.background, 0, 0);
            return;
        }
        
        this.context.fillStyle = this.config.COLORS.BACKGROUND;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.cache.background = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    public renderFieldGrid = (): void => {
        if (this.cache.grid) {
            this.context.putImageData(this.cache.grid, 0, 0);
            return;
        }
        
        this.context.strokeStyle = this.config.COLORS.GRID;
        this.context.lineWidth = 0.5;
        

        for (let x = 0; x < this.config.FIELD_WIDTH; x++) {
            this.context.beginPath();
            this.context.moveTo(x * this.config.CELL_SIZE, 0);
            this.context.lineTo(x * this.config.CELL_SIZE, this.canvas.height);
            this.context.stroke();
        }
        

        for (let y = 0; y <= this.config.FIELD_HEIGHT; y++) {
            this.context.beginPath();
            this.context.moveTo(0, y * this.config.CELL_SIZE);
            this.context.lineTo(this.canvas.width, y * this.config.CELL_SIZE);
            this.context.stroke();
        }
        
        this.cache.grid = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default CanvasRenderer;