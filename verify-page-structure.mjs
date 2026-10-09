import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const root = import.meta.dirname;
const app = readFileSync(resolve(root, "App.tsx"), "utf8");
const data = readFileSync(resolve(root, "site.ts"), "utf8");

const orderedSections = [
  'id="overview"',
  'id="motivation"',
  'id="method"',
  'id="results"',
  'id="demos"',
  'id="contact"',
];

let previousIndex = -1;
for (const section of orderedSections) {
  const index = app.indexOf(section);
  assert.ok(index > previousIndex, `${section} must exist in the requested order`);
  previousIndex = index;
}

assert.match(app, /<span>&lt;talk&gt;<\/span>/, "overview must show a <talk> action");
assert.match(app, /<span>&lt;move&gt;<\/span>/, "overview must show a <move> action");
assert.match(app, /className="overview-move-route"/, "overview move action must include a route graphic");
assert.doesNotMatch(app, /className="method-flow"/, "the old method diagram must be replaced by video");

const expectedVideos = [
  ["only_method.mp4", "Method Overview"],
  ["demo1_objectnav.mp4", "ObjectNav"],
  ["demo2_iign.mp4", "Simple IIGN"],
  ["demo3_iign.mp4", "IIGN with Target Disappearance"],
  ["demo4_iign.mp4", "Long-Horizon IIGN"],
];

for (const [fileName, title] of expectedVideos) {
  assert.ok(data.includes(fileName), `${fileName} must be mapped in site data`);
  assert.ok(data.includes(title), `${title} must appear in site data`);
  assert.ok(existsSync(resolve(root, "video", fileName)), `${fileName} must exist in the provided video directory`);
}

assert.ok(app.includes("zhushh9@zju.edu.cn"), "contact email must be rendered");

assert.doesNotMatch(app, /brand__mascot/, "top navigation mascot must be removed");
assert.doesNotMatch(app, /topbar__paper/, "top navigation paper button must be removed");
assert.doesNotMatch(app, /poster=\{entry\.poster\}/, "videos must show their own opening frame");
assert.match(app, /preload="metadata"/, "videos must preload metadata for the opening frame");

assert.match(app, /68%/, "motivation must retain the 68% finding");
assert.match(app, /but the robot still fails to reach it/i, "motivation must explain the core failure");
assert.match(app, /className="motivation-insight"/, "motivation must highlight the needed mechanism");
assert.doesNotMatch(app, /failure-stat--miss/, "41% statistic must be removed");
assert.doesNotMatch(app, /failure-stat--stop/, "20% statistic must be removed");

assert.match(app, /How GG-Nav reasons from observation to action/, "method must use the concise title");
assert.match(app, /className="result-keyword"/, "result dataset and task names must be visually emphasized");
assert.doesNotMatch(app, /className="real-world-panel"/, "Unitree Go2 results panel must be removed");
assert.doesNotMatch(app, /className="figure-banner"/, "case-study banner must be removed");

assert.doesNotMatch(app, />Abstract</, "citation section must not include the abstract accordion");
assert.doesNotMatch(app, />Contributions</, "citation section must not include contributions");
assert.doesNotMatch(app, /className="paper-figure"/, "citation section must not include the paper preview");
assert.doesNotMatch(app, /className="paper-actions"/, "citation section must stay compact");

console.log("Page structure and media contract verified.");
