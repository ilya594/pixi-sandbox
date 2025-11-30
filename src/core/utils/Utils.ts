import { IFieldPosition } from "../../common";
import { GameConfig } from "../config/Config";
import { ObjectPosition } from "../view/ObjectPosition";

// Remove old conversion functions, keep utilities
export const getRandomWithin = (max: number, min: number = 0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getUniquePositions = (n: number, m: number, count: number, points: Array<IFieldPosition> = []): Array<IFieldPosition> => {
    if (points.length === count) return points;
    const x = Math.floor(Math.random() * (n - 2)) + 1;
    const y = Math.floor(Math.random() * (m - 2)) + 1;
    const exists = points.some(p => p.x === x && p.y === y);
    return getUniquePositions(n, m, count, exists ? points : [...points, { x, y }]);
};

export const checkRectanglesIntersection = (first: any, second: any): boolean => {
    return Boolean(first.hitArea.contains(second.x, second.y) || second.hitArea.contains(first.x, first.y));
}

export const getPriceText = (price: number): string => {
    const named: number = 10;
    let result = '';
    if (price >= named && price < named * 2) {
        result = GameConfig.SCORE.DEFAULT + GameConfig.SCORE.SUFFIXES_DECIMAL[price - named];
    } else {
        result = GameConfig.SCORE.DEFAULT + GameConfig.SCORE.SUFFIXES[Number((String(price)).slice(-1))];
    }
    return result;
}

// Updated P function using ObjectPosition
export const P = (position: any): ObjectPosition => {
    if (position.type === "global") return ObjectPosition.fromPixels(position.x, position.y);
    if (position.type === "field") return ObjectPosition.fromField(position.x, position.y);
    if (position instanceof ObjectPosition) return position.clone();
    if (position.x !== undefined && position.y !== undefined) return ObjectPosition.fromPixels(position.x, position.y);
    return ObjectPosition.fromPixels(0, 0);
}