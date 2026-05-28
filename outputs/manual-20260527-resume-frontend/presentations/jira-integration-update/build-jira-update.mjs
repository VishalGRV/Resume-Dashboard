import path from "node:path";
import { FileBlob, PresentationFile } from "file:///C:/Users/Vishal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const input = path.resolve("outputs/manual-20260527-resume-frontend/presentations/frontend-intro/output/ai-resume-frontend-presentation.pptx");
const output = path.resolve("outputs/manual-20260527-resume-frontend/presentations/jira-integration-update/output/ai-resume-frontend-jira-integration.pptx");

const C = {
  bg: "#070A12",
  panel: "#101827",
  panel2: "#0B1220",
  line: "#263449",
  text: "#F8FAFC",
  muted: "#94A3B8",
  soft: "#CBD5E1",
  teal: "#2DD4BF",
  sky: "#38BDF8",
  amber: "#FBBF24",
  rose: "#FB7185",
  green: "#34D399",
  blue: "#60A5FA"
};

function line(fill = "#00000000", width = 0, style = "solid") {
  return { style, fill, width };
}

function shape(slide, { geometry = "rect", x, y, w, h, fill = "#00000000", stroke = "#00000000", strokeWidth = 0, name }) {
  return slide.shapes.add({
    geometry,
    name,
    position: { x, y, w, h },
    fill,
    line: line(stroke, strokeWidth)
  });
}

function text(slide, value, x, y, w, h, opts = {}) {
  const s = shape(slide, { x, y, w, h, fill: opts.fill ?? "#00000000", stroke: opts.stroke ?? "#00000000", strokeWidth: opts.strokeWidth ?? 0 });
  s.text = value;
  s.text.fontSize = opts.size ?? 20;
  s.text.color = opts.color ?? C.soft;
  s.text.bold = Boolean(opts.bold);
  s.text.typeface = opts.face ?? "Aptos";
  s.text.alignment = opts.align ?? "left";
  s.text.verticalAlignment = opts.valign ?? "top";
  s.text.insets = opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 };
  return s;
}

function bg(slide) {
  shape(slide, { x: 0, y: 0, w: 1280, h: 720, fill: C.bg });
  shape(slide, { x: 0, y: 0, w: 1280, h: 720, fill: "linear(135deg, #070A12, #0F172A 52%, #07111F)" });
  shape(slide, { x: -120, y: -120, w: 440, h: 440, geometry: "ellipse", fill: "#0D948833" });
  shape(slide, { x: 960, y: -110, w: 420, h: 420, geometry: "ellipse", fill: "#0284C733" });
}

function footer(slide, n) {
  text(slide, "AI Resume Intelligence Dashboard | Jira Tool Integration", 64, 666, 620, 24, { size: 13, color: C.muted });
  text(slide, String(n).padStart(2, "0"), 1160, 666, 56, 24, { size: 13, color: C.muted, align: "right" });
}

function kicker(slide, label) {
  shape(slide, { x: 64, y: 59, w: 10, h: 10, geometry: "ellipse", fill: C.teal });
  text(slide, label.toUpperCase(), 84, 54, 560, 24, { size: 13, bold: true, color: C.teal });
}

function title(slide, value, y = 92, size = 42, w = 980) {
  text(slide, value, 64, y, w, 112, { size, bold: true, color: C.text, face: "Aptos Display" });
}

function card(slide, x, y, w, h, fill = "#0B1220DD") {
  shape(slide, { x, y, w, h, geometry: "roundRect", fill, stroke: "#334155", strokeWidth: 1 });
}

function pill(slide, value, x, y, w, color = C.teal) {
  shape(slide, { x, y, w, h: 30, geometry: "roundRect", fill: `${color}22`, stroke: `${color}88`, strokeWidth: 1 });
  text(slide, value, x + 10, y + 7, w - 20, 18, { size: 13, bold: true, color: C.text, align: "center" });
}

function bullet(slide, value, x, y, color = C.teal, w = 440) {
  shape(slide, { x, y: y + 8, w: 8, h: 8, geometry: "ellipse", fill: color });
  text(slide, value, x + 20, y, w, 44, { size: 18, color: C.soft });
}

function jiraCard(slide, value, key, x, y, w, priority = "high", due) {
  card(slide, x, y, w, due ? 104 : 84, "#20242CCC");
  text(slide, value, x + 18, y + 14, w - 36, 42, { size: 16, color: C.text, bold: value.length < 45 });
  text(slide, key, x + 18, y + (due ? 76 : 58), 90, 20, { size: 13, color: C.blue, bold: true });
  const color = priority === "medium" ? C.amber : C.rose;
  shape(slide, { x: x + w - 42, y: y + (due ? 76 : 58), w: 12, h: 3, fill: color });
  if (due) {
    text(slide, due, x + 18, y + 58, 122, 20, { size: 13, color: C.soft, fill: "#111827", stroke: "#475569", strokeWidth: 1, insets: { left: 8, right: 8, top: 2, bottom: 2 } });
  }
}

function slideSprintBoard(presentation) {
  const slide = presentation.slides.add();
  bg(slide);
  kicker(slide, "Jira Tool Integration");
  title(slide, "Sprint 3 active board shows sprint execution and live task status.", 92, 40, 980);
  pill(slide, "Active sprints", 76, 198, 132, C.blue);
  pill(slide, "Group: Stories", 222, 198, 142, C.teal);
  pill(slide, "Sprint 3", 378, 198, 96, C.amber);
  const cols = [
    ["TO DO", "5", 72, ["ARP-53 Resume data saved securely", "ARP-28 Show upload/input errors", "ARP-37 Create Prisma client utility"], C.rose],
    ["IN PROGRESS", "3", 478, ["ARP-38 Save resume text to database", "ARP-27 Handle submit loading state", "ARP-35 Create Prisma schema models"], C.amber],
    ["DONE", "0", 884, ["Ready for completed sprint items", "Used to verify closure during demo"], C.green]
  ];
  cols.forEach(([name, count, x, items, accent]) => {
    shape(slide, { x, y: 244, w: 340, h: 356, fill: "#151A21CC", stroke: "#1E293B", strokeWidth: 1 });
    text(slide, `${name}  ${count}`, x + 18, 264, 180, 24, { size: 15, bold: true, color: C.soft });
    items.forEach((item, i) => jiraCard(slide, item, i === 0 && name === "TO DO" ? "ARP-53" : i === 0 && name === "IN PROGRESS" ? "ARP-38" : `ARP-${28 + i}`, x + 18, 304 + i * 92, 304, name === "IN PROGRESS" ? "medium" : "high"));
  });
  footer(slide, 7);
  return slide;
}

function slideBacklogOverview(presentation) {
  const slide = presentation.slides.add();
  bg(slide);
  kicker(slide, "Jira Backlog");
  title(slide, "Backlog keeps remaining work visible before it enters a sprint.", 92, 42, 980);
  card(slide, 70, 234, 1140, 310);
  text(slide, "Backlog  |  21 work items", 104, 266, 360, 30, { size: 24, bold: true, color: C.text });
  const items = [
    ["ARP-39", "Save analysis report to database"],
    ["ARP-45", "Display analysis history"],
    ["ARP-21", "Show authentication loading and error states"],
    ["ARP-23", "Redirect unauthenticated users from protected pages"],
    ["ARP-29", "Define skill categories"],
    ["ARP-30", "Implement skill detection logic"],
    ["ARP-31", "Implement missing skills logic"],
    ["ARP-32", "Implement ATS score calculation"]
  ];
  items.forEach(([key, label], i) => {
    const x = i < 4 ? 104 : 652;
    const y = 322 + (i % 4) * 48;
    text(slide, key, x, y, 80, 22, { size: 15, bold: true, color: C.blue });
    text(slide, label, x + 92, y, 420, 24, { size: 17, color: C.soft });
    pill(slide, "TO DO", x + 450, y - 3, 68, C.soft);
  });
  footer(slide, 8);
  return slide;
}

function slideBacklogStories(presentation) {
  const slide = presentation.slides.add();
  bg(slide);
  kicker(slide, "Backlog Stories");
  title(slide, "Stories translate project features into user-focused work items.", 92, 42, 990);
  const stories = [
    ["ARP-40", "Display score cards on dashboard", "Users quickly understand ATS, frontend, backend, and readiness scores."],
    ["ARP-41", "Render skill distribution chart", "Users see skill categories visually."],
    ["ARP-42", "Render score breakdown chart", "Users compare all resume scores."],
    ["ARP-43", "Display strengths, weaknesses, and recommendations", "Users receive actionable feedback."],
    ["ARP-44", "Display detected and missing skills as badges", "Users scan skills and gaps easily."]
  ];
  stories.forEach(([key, titleText, note], i) => {
    const y = 218 + i * 78;
    card(slide, 92, y, 1096, 58, "#111827DD");
    text(slide, key, 120, y + 18, 84, 22, { size: 15, bold: true, color: C.blue });
    text(slide, titleText, 218, y + 12, 420, 26, { size: 19, bold: true, color: C.text });
    text(slide, note, 670, y + 14, 420, 24, { size: 16, color: C.muted });
    pill(slide, "Story", 1100, y + 14, 66, C.teal);
  });
  footer(slide, 9);
  return slide;
}

function slideSummary(presentation) {
  const slide = presentation.slides.add();
  bg(slide);
  kicker(slide, "Jira Summary");
  title(slide, "Jira supports SCM by connecting requirements, tasks, sprints, and verification.", 92, 40, 1020);
  const blocks = [
    ["Traceability", "Each issue maps a requirement to implementation work.", C.teal],
    ["Sprint control", "Sprint 3 shows what is planned, in progress, and pending.", C.sky],
    ["Change tracking", "New features enter the backlog before development.", C.amber],
    ["Demo readiness", "Testing tasks verify build, auth, resume analysis, and PDF handling.", C.green]
  ];
  blocks.forEach(([head, body, color], i) => {
    const x = i % 2 === 0 ? 94 : 660;
    const y = i < 2 ? 244 : 410;
    card(slide, x, y, 500, 118, "#0B1220DD");
    shape(slide, { x: x + 24, y: y + 28, w: 12, h: 12, geometry: "ellipse", fill: color });
    text(slide, head, x + 48, y + 20, 380, 28, { size: 23, bold: true, color: C.text });
    text(slide, body, x + 48, y + 58, 390, 36, { size: 17, color: C.soft });
  });
  footer(slide, 10);
  return slide;
}

function slideStoriesView(presentation) {
  const slide = presentation.slides.add();
  bg(slide);
  kicker(slide, "Stories View");
  title(slide, "Story grouping highlights user value for Sprint 3.", 92, 42, 980);
  card(slide, 98, 222, 1084, 340, "#151A21DD");
  text(slide, "TO DO   3/5", 130, 248, 180, 24, { size: 16, bold: true, color: C.soft });
  const stories = [
    ["ARP-53", "As a user, I want my resume data to be saved securely so that I can access previous analysis reports later."],
    ["ARP-54", "As a user, I want visual feedback during resume submission so that I understand the current processing state."],
    ["ARP-55", "As a developer, I want reusable Prisma utilities and schema models so that database operations remain maintainable and scalable."]
  ];
  stories.forEach(([key, label], i) => {
    const y = 292 + i * 82;
    jiraCard(slide, label, key, 130, y, 1018, i === 2 ? "medium" : "high", "May 30, 2026");
  });
  pill(slide, "Type: Story", 880, 238, 110, C.blue);
  pill(slide, "Active sprints", 1006, 238, 126, C.teal);
  footer(slide, 11);
  return slide;
}

const presentation = await PresentationFile.importPptx(await FileBlob.load(input));
slideSprintBoard(presentation);
slideBacklogOverview(presentation);
slideBacklogStories(presentation);
slideSummary(presentation);
slideStoriesView(presentation);

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(output);
console.log(output);
