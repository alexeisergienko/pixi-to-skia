type SceneNode =
  | RectNode
  | EllipseNode
  | LineNode;

export interface BaseNode {
  transform: Transform;
}

export interface Transform {
  a: number;
  b: number;
  c: number;
  d: number;
  tx: number;
  ty: number;
}

export interface RectNode extends BaseNode {
  type: "rect";
  width: number;
  height: number;
  color: string;
}

export interface EllipseNode extends BaseNode {
  type: "ellipse";
  radiusX: number;
  radiusY: number;
  color: string;
}

export interface LineNode extends BaseNode {
  type: "line";
  points: number[];
  color: string;
  width: number;
}

export interface SerializedScene extends Array<SceneNode> {};