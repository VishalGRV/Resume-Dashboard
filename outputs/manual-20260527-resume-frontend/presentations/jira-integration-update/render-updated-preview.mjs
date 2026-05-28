import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, PresentationFile } from "file:///C:/Users/Vishal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const ppt = path.resolve("outputs/manual-20260527-resume-frontend/presentations/jira-integration-update/output/ai-resume-frontend-jira-integration.pptx");
const previewDir = path.resolve("outputs/manual-20260527-resume-frontend/presentations/jira-integration-update/preview");
await fs.mkdir(previewDir, { recursive: true });

const presentation = await PresentationFile.importPptx(await FileBlob.load(ppt));
for (let i = 0; i < presentation.slides.count; i += 1) {
  const slide = presentation.slides.getItem(i);
  const png = await presentation.export({ slide, format: "png", scale: 0.6 });
  const buffer = Buffer.from(await png.arrayBuffer());
  await fs.writeFile(path.join(previewDir, `slide-${String(i + 1).padStart(2, "0")}.png`), buffer);
}
console.log(JSON.stringify({ slideCount: presentation.slides.count, previewDir }, null, 2));
