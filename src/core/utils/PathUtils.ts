import { IGridCellType, IFieldPosition } from "../../common";

class PathNode {
    public x: number;
    public y: number;
    public g: number;
    public h: number;
    public f: number;
    public parent: PathNode | null;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.g = 0;
        this.h = 0;
        this.f = 0;
        this.parent = null;
    }
}

/**
 *  Methods kindly provided by AI :)
 */

class PathFinder {

    public isObstacle = (field: Uint8Array[], position: IFieldPosition): boolean => {
        return field[position.y][position.x] === IGridCellType.OBSTACLE;
    }

    private isValidPosition = (field: Uint8Array[], position: IFieldPosition): boolean => {
        return (position.y >= 0 && position.y < field.length &&
            position.x >= 0 && position.x < field[0].length);
    }

    public findPath = (field: Uint8Array[], start: IFieldPosition, target: IFieldPosition, smooth: boolean = false): IFieldPosition[] | null => {
        if (this.isObstacle(field, target) || !this.isValidPosition(field, target)) return null;

        const openSet: PathNode[] = [];
        const closedSet = new Set<string>();

        const startPathNode = new PathNode(start.x, start.y);
        openSet.push(startPathNode);

        while (openSet.length > 0) {
            let lowestIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }

            const current = openSet[lowestIndex];

            if (current.x === target.x && current.y === target.y) {
                return smooth ? this.smoothPath(field, this.reconstructPath(current)) : this.reconstructPath(current);
            }

            // Move current from open to closed set
            openSet.splice(lowestIndex, 1);
            closedSet.add(`${current.x},${current.y}`);

            // Check all neighbors
            const neighbors = this.getNeighbors(field, current);

            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;

                // Skip if already evaluated
                if (closedSet.has(neighborKey)) {
                    continue;
                }

                const isDiagonal = Math.abs(neighbor.x - current.x) + Math.abs(neighbor.y - current.y) === 2;
                const moveCost = isDiagonal ? Math.SQRT2 : 1;
                const tentativeG = current.g + moveCost;

                // Check if this is a better path
                let neighborInOpenSet = false;
                let existingNeighbor: PathNode | null = null;

                for (const PathNode of openSet) {
                    if (PathNode.x === neighbor.x && PathNode.y === neighbor.y) {
                        neighborInOpenSet = true;
                        existingNeighbor = PathNode;
                        break;
                    }
                }

                if (!neighborInOpenSet || tentativeG < existingNeighbor!.g) {
                    neighbor.parent = current;
                    neighbor.g = tentativeG;
                    neighbor.h = this.heuristic(neighbor, target);
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!neighborInOpenSet) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        // No path found
        return null;
    }

    public findLazyPath = (field: Uint8Array[], start: IFieldPosition, target: IFieldPosition): IFieldPosition[] | null => {
        // First find the full path using the normal A* algorithm
        const fullPath = this.findPath(field, start, target);

        if (!fullPath || fullPath.length <= 1) {
            return fullPath;
        }

        // Calculate halfway point (approximately)
        const halfwayIndex = Math.floor(fullPath.length / 2);

        // Take the path up to the halfway point
        const pathToHalfway = fullPath.slice(0, halfwayIndex + 1);

        // Create the return path by reversing the path (excluding the last point to avoid duplicate)
        const returnPath = [...pathToHalfway.slice(0, -1).reverse()];

        // Combine both paths: go to halfway and then return back to start
        const lazyPath = [...pathToHalfway, ...returnPath];

        return lazyPath;
    }

    // Alternative version that goes to a random point near the target and returns
    public findLazyPathVariant = (field: Uint8Array[], start: IFieldPosition, target: IFieldPosition): IFieldPosition[] | null => {
        // Find full path first
        const fullPath = this.findPath(field, start, target);

        if (!fullPath || fullPath.length <= 1) {
            return fullPath;
        }

        // Go only 70% of the way then return
        const partialIndex = Math.floor(fullPath.length * 0.7);
        const pathToPartial = fullPath.slice(0, partialIndex + 1);

        // Return back to start
        const returnPath = [...pathToPartial.slice(0, -1).reverse()];

        return [...pathToPartial, ...returnPath];
    }

    private getNeighbors = (field: Uint8Array[], pathNode: PathNode): PathNode[] => {
        const neighbors: PathNode[] = [];
        const directions = [
            // Cardinal directions (cost: 1)
            { dx: 0, dy: -1 },  // up
            { dx: 1, dy: 0 },   // right
            { dx: 0, dy: 1 },   // down
            { dx: -1, dy: 0 },  // left

            // Diagonal directions (cost: √2 ≈ 1.414)
            { dx: -1, dy: -1 }, // up-left
            { dx: 1, dy: -1 },  // up-right
            { dx: -1, dy: 1 },  // down-left
            { dx: 1, dy: 1 }    // down-right
        ];

        for (const dir of directions) {
            const newX = pathNode.x + dir.dx;
            const newY = pathNode.y + dir.dy;

            if (this.isValidPosition(field, { x: newX, y: newY }) && field[newY][newX] === 0) {
                neighbors.push(new PathNode(newX, newY));
            }
        }

        return neighbors;
    }


    private heuristic = (PathNode: PathNode, target: IFieldPosition): number => {
        // Euclidean distance for diagonal movement
        return Math.sqrt(Math.pow(PathNode.x - target.x, 2) + Math.pow(PathNode.y - target.y, 2));
    }

    private reconstructPath = (PathNode: PathNode): IFieldPosition[] => {
        const path: IFieldPosition[] = [];
        let current: PathNode | null = PathNode;

        while (current !== null) {
            path.unshift({ x: current.x, y: current.y });
            current = current.parent;
        }

        return path;
    }

    private smoothPath = (field: Uint8Array[], path: Array<IFieldPosition>): Array<IFieldPosition> => {
        if (path.length <= 2) return path;

        const smoothed: IFieldPosition[] = [path[0]];

        for (let i = 2; i < path.length; i++) {
            const prev = path[i - 2];
            const current = path[i - 1];
            const next = path[i];

            // Only smooth if movement is horizontal or vertical, not diagonal
            const isStraightLine = (prev.x === current.x && current.x === next.x) ||
                (prev.y === current.y && current.y === next.y);

            if (isStraightLine && this.canWalkStraight(field, prev, next)) {
                // Skip the middle point if we can walk straight
                continue;
            } else {
                smoothed.push(current);
            }
        }

        smoothed.push(path[path.length - 1]);
        return smoothed;
    }

    private canWalkStraight = (field: Uint8Array[], from: IFieldPosition, to: IFieldPosition): boolean => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        // If moving diagonally, check if both adjacent orthogonal moves are clear
        if (dx !== 0 && dy !== 0) {
            const canMoveHorizontally = this.checkOrthogonalLine(field, from, { x: to.x, y: from.y });
            const canMoveVertically = this.checkOrthogonalLine(field, from, { x: from.x, y: to.y });

            // For diagonal movement, require both orthogonal paths to be clear
            if (!canMoveHorizontally || !canMoveVertically) {
                return false;
            }
        }

        // Check the straight line
        return this.checkOrthogonalLine(field, from, to);
    }

    private checkOrthogonalLine = (field: Uint8Array[], from: IFieldPosition, to: IFieldPosition): boolean => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.max(Math.abs(dx), Math.abs(dy));

        for (let i = 1; i < distance; i++) {
            const t = i / distance;
            const x = Math.round(from.x + dx * t);
            const y = Math.round(from.y + dy * t);

            if (y < 0 || y >= field.length || x < 0 || x >= field[0].length) {
                return false;
            }

            if (field[y][x] !== 0) {
                return false;
            }
        }

        return true;
    }
}



export default PathFinder;