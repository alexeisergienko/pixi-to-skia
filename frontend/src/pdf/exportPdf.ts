import { SerializedScene } from "../serialization/types";

export async function exportToPdf(sceneData: SerializedScene) {
  const response = await fetch("http://localhost:3001/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sceneData)
  });

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "scene.pdf";

  a.click();

  URL.revokeObjectURL(url);
}