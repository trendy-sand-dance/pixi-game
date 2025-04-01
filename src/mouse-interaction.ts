import { Graphics, Text } from "pixi.js";
import { Vector2 } from './interfaces.js';
import GameMap from './gamemap.js';
import * as settings from './settings.js';


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

export function moveMapWithMouse(mousePos: Vector2, map: GameMap, focused: boolean) {
  if (!focused)
    return;

  let bufferHorizontal = window.screen.width * 0.25;
  let bufferVertical = window.screen.height * 0.25;
  let dir = { x: 0, y: 0 };
  let moveIntensity = 10;

  // Right-hand side
  if (mousePos.x >= (window.screen.width - bufferHorizontal)) {
    let fraction = (mousePos.x - (window.screen.width - bufferHorizontal)) / bufferHorizontal;
    dir.x -= fraction * moveIntensity;
  }
  // Left-hand side
  if (mousePos.x <= bufferHorizontal) {
    let fraction = (bufferHorizontal - mousePos.x) / bufferHorizontal;
    dir.x += fraction * moveIntensity;
  }

  // Top side
  if (mousePos.y <= bufferVertical) {
    let fraction = (bufferVertical - mousePos.y) / bufferVertical;
    dir.y += fraction * moveIntensity;
  }

  // Bot side
  if (mousePos.y >= (window.screen.height - bufferVertical)) {
    let fraction = (mousePos.y - (window.screen.height - bufferVertical)) / bufferVertical;
    dir.y -= fraction * moveIntensity;
  }
  map.moveMap(dir);
}

export function setupMapZoom(mousePos: Vector2, map: GameMap) {

  window.addEventListener('wheel', (event) => {
    let zoomIntensity = 0.05;
    let minZoom = 0.75;
    let maxZoom = 2;
    let scrollDir = event.deltaY / Math.abs(event.deltaY);

    enum Dir {
      Up = -1,
      Down = 1,
    }

    let container = map.getContainer();

    if (scrollDir == Dir.Up && container.scale.x < maxZoom) {
      const scaleFactor = 1 - (container.scale.x / (container.scale.x + zoomIntensity));
      container.scale.x += zoomIntensity;
      container.scale.y += zoomIntensity;

      container.x -= (mousePos.x - container.x) * scaleFactor;
      container.y -= (mousePos.y - container.y) * scaleFactor;
    }
    else if (scrollDir == Dir.Down && container.scale.x > minZoom) {
      const scaleFactor = 1 - (container.scale.x / (container.scale.x + zoomIntensity));
      container.scale.x -= zoomIntensity;
      container.scale.y -= zoomIntensity;

      container.x += (mousePos.x - container.x) * scaleFactor;
      container.y += (mousePos.y - container.y) * scaleFactor;
    }
  })

}
