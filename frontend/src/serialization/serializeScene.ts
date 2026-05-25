import * as PIXI from "pixi.js-legacy";
import { BaseNode, EllipseNode, LineNode, RectNode, SerializedScene } from "./types";

export function serializeScene(
  container: PIXI.Container
) {
  const result: SerializedScene = [];

  for (const child of container.children) {
    if (!(child instanceof PIXI.Graphics)) {
      continue;
    }

    const { worldTransform: { array, ...transform } } = child;

    const geometry = (child.geometry as any).graphicsData;

    for (const item of geometry) {
      const shape = item.shape;

      if (shape.type === PIXI.SHAPES.RECT) {
        result.push({
          transform,
          type: "rect",
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          color: item.fillStyle.color
        } as RectNode);
      } else if (shape.type === PIXI.SHAPES.ELIP) {
        result.push({
          transform,
          type: "ellipse",
          x: shape.x,
          y: shape.y,
          radiusX: shape.width,
          radiusY: shape.height,
          color: item.fillStyle.color
        } as EllipseNode);
      } else if (shape.type === PIXI.SHAPES.POLY) {
        result.push({
          transform,
          type: "line",
          points: shape.points,
          width: item.lineStyle.width,
          color: item.lineStyle.color
        } as LineNode);
      }
    }
  }

  return result;
}