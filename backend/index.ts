import express from "express";
import { Canvas } from "skia-canvas";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

app.post("/pdf", async (req, res) => {
  const canvas = new Canvas(600, 400);

  const ctx = canvas.getContext("2d");

  for (const shape of req.body) {
    ctx.save();

    ctx.transform(
      shape.transform.a,
      shape.transform.b,
      shape.transform.c,
      shape.transform.d,
      shape.transform.tx,
      shape.transform.ty
    );

    if (shape.type === "rect") {
      ctx.fillStyle = pixiColorToCss(shape.color);

      ctx.fillRect(
        shape.x,
        shape.y,
        shape.width,
        shape.height
      );
    } else if (shape.type === "ellipse") {
      ctx.fillStyle = pixiColorToCss(shape.color);

      ctx.beginPath();

      ctx.ellipse(
        shape.x,
        shape.y,
        shape.radiusX,
        shape.radiusY,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();
    } else if (shape.type === "line") {
      ctx.strokeStyle = pixiColorToCss(shape.color);

      ctx.lineWidth = shape.width;

      const points = shape.points;

      ctx.beginPath();

      ctx.moveTo(points[0], points[1]);

      for (let i = 2; i < points.length; i += 2) {
        ctx.lineTo(points[i], points[i + 1]);
      }

      ctx.stroke();
    }

    ctx.restore();
  }

  const pdfBuffer = await canvas.toBuffer("pdf");

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.send(pdfBuffer);
});

app.listen(3001);

function pixiColorToCss(color: number) {
  return `#${color.toString(16).padStart(6, '0')}`;
}
