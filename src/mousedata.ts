import { Graphics, Text } from "pixi.js";
import { Vector2 } from './interfaces.js';


export class MouseData {

  public textInfo: Text;
  public graphicsSelector: Graphics;
  public position: Vector2;

  constructor(x: number, y: number) {
    this.textInfo = new Text({
      text: "Default text", style: {
        fontSize: 16,
      },
      position: {
        x: x,
        y: y,
      }
    });
    this.graphicsSelector = new Graphics();
    this.position = { x: 0, y: 0 };
  }

  setMousePosition(pos: Vector2) {
    this.position = pos;
  }

  getGraphicsContext() {
    return this.graphicsSelector;
  }
}
