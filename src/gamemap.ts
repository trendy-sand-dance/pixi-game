import { Assets, Container, Graphics, TilingSprite } from "pixi.js";
import { Point, Vector2 } from './interfaces.js';
import * as settings from './settings.js';

export default class GameMap {

  public container: Container;

  private graphicsContext: Graphics;
  private spriteTiles: TilingSprite[][] = [];
  private rows: number;
  private cols: number;
  private tileSize: number;

  constructor(rows: number, cols: number, tileSize: number) {

    this.container = new Container();

    this.graphicsContext = new Graphics();
    this.container.addChild(this.graphicsContext);

    this.rows = rows;
    this.cols = cols;
    this.tileSize = tileSize;
  }

  async initSpriteTiles(rows: number, cols: number) {
    try {
      const texture = await Assets.load('/assets/bunny.png');
      if (!texture) {
        console.error("Failed to load texture.");
        return;
      }
      this.spriteTiles = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => new TilingSprite({ texture, width: 64, height: 64 }))
      );

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          this.spriteTiles[row][col].anchor.set(0.5);

          this.container.addChild(this.spriteTiles[row][col]);
        }
      }
    } catch (error) {
      console.error("Error initializing sprite tiles:", error);
    }
  }

  drawIsometricTile(context: Graphics, point: Vector2, w: number, h: number, outline: boolean) {
    context.poly([point.x, point.y, point.x + w, point.y + h / 2, point.x, point.y + h, point.x - w, point.y + h / 2, point.x, point.y]);
    if (outline) {
      context.stroke({ color: 0xff0000 });
    }
    else {
      context.fill(0x777777);
      context.stroke({ color: 0xffffff });
    }
  }

  async createGridFromMap(tileMap: number[][]) {

    // await this.initSpriteTiles(this.rows, this.cols);

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let point = new Point(col, row);

        // Raise Y 
        // point.asIsometric.y -= tileMap[row][col] * this.tileSize / 2;

        // this.spriteTiles[row][col].x = point.asIsometric.x;
        // this.spriteTiles[row][col].y = point.asIsometric.y;
        point.add({ x: settings.WIDTH / 2, y: 0 });

        this.drawIsometricTile(this.graphicsContext, point.asIsometric, this.tileSize, this.tileSize, false);
        // this.drawIsometricTile(this.graphicsContext, point.asCartesian, this.tileSize, this.tileSize, false);
      }
    }
  }

  getContainer() {
    return this.container;
  }
}
