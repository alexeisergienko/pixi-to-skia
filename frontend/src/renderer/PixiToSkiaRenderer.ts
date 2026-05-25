import * as PIXI from "pixi.js-legacy";

export class PixiToSkiaRenderer {
  constructor(private CanvasKit: any) {}

  render(container: PIXI.Container, canvas: any) {
    for (const child of container.children) {
      canvas.save();

      this.applyTransform(canvas, child);

      if (child instanceof PIXI.Graphics) {
        this.renderGraphics(child, canvas);
      }

      if (child instanceof PIXI.Container) {
        this.render(child, canvas);
      }

      canvas.restore();
    }
  }

  private applyTransform(canvas: any, object: PIXI.DisplayObject) {
    const m = object.worldTransform;

    canvas.concat([
      m.a,
      m.c,
      m.tx,

      m.b,
      m.d,
      m.ty,

      0,
      0,
      1
    ]);
  }

  private renderGraphics(graphics: PIXI.Graphics, canvas: any) {
    const paint = new this.CanvasKit.Paint();

    const geometry = (graphics.geometry as any).graphicsData;

    for (const item of geometry) {
      const shape = item.shape;

      paint.setAntiAlias(true);

      if (item.fillStyle?.color !== undefined) {
        const color = item.fillStyle.color;

        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;

        paint.setColor(this.CanvasKit.Color(r, g, b, 1));
      }

      if (shape.type === PIXI.SHAPES.RECT) {
        canvas.drawRect(
          this.CanvasKit.XYWHRect(
            shape.x,
            shape.y,
            shape.width,
            shape.height
          ),
          paint
        );
      }

      if (shape.type === PIXI.SHAPES.ELIP) {
        canvas.drawOval(
          this.CanvasKit.XYWHRect(
            shape.x - shape.width,
            shape.y - shape.height,
            shape.width * 2,
            shape.height * 2
          ),
          paint
        );
      }

      if (shape.type === PIXI.SHAPES.POLY) {
        const path = new this.CanvasKit.Path();

        const points = shape.points;

        path.moveTo(points[0], points[1]);

        for (let i = 2; i < points.length; i += 2) {
          path.lineTo(points[i], points[i + 1]);
        }

        paint.setStyle(this.CanvasKit.PaintStyle.Stroke);

        paint.setStrokeWidth(
          item.lineStyle?.width || 1
        );

        if (item.lineStyle?.color !== undefined) {
          const color = item.lineStyle.color;

          const r = ((color >> 16) & 255) / 255;
          const g = ((color >> 8) & 255) / 255;
          const b = (color & 255) / 255;

          paint.setColor(
            this.CanvasKit.Color4f(r, g, b, 1)
          );
        }

        canvas.drawPath(path, paint);

        path.delete();
      }
    }

    paint.delete();
  }
}
