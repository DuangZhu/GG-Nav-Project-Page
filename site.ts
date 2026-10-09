const withBase = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export type VideoId =
  | "overview"
  | "objectnav"
  | "iign-easy"
  | "iign-medium"
  | "iign-hard";

export type VideoEntry = {
  id: VideoId;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  src: string;
  poster: string;
  posterPosition?: string;
  captions?: string;
  facts: string[];
};

export type Author = {
  name: string;
  affiliations: number[];
  mark?: string;
};

export const siteConfig = {
  shortTitle: "GG-Nav",
  title:
    "GG-Nav: Goal-oriented Grounding Chain-of-Thought Elicits Reasoning in Navigation Foundation Models",
  description:
    "A structured grounding chain-of-thought that preserves transient visual evidence, explicitly localizes goal-relevant instances, and supports reliable navigation or clarification.",
  paperUrl: withBase("paper/GG-Nav.pdf"),
  codeUrl: "https://github.com/DuangZhu/GG-Nav",
  teaserUrl: withBase("assets/teaser.png"),
  methodUrl: withBase("assets/method-framework.png"),
  caseStudyUrl: withBase("assets/case-study.png"),
  realWorldUrl: withBase("assets/real-world.png"),
  motivationUrl: withBase("assets/motivation.png"),
  mascotUrl: withBase("assets/ggb.png"),
  abstract:
    "Emerging strong Vision-Language Models (VLMs) have advanced navigation foundation models. However, these models still have unsatisfactory performance on goal-oriented navigation settings. We first reveal that the key issue lies in the insufficient utilization of streaming observations and imprecise target localization. GG-Nav learns a structured chain-of-thought mechanism via supervised fine-tuning to explicitly localize goal-relevant instances, accumulate grounding evidence, and support more reliable decision-making. Observation-to-Evidence reasons over all intermediate frames between adjacent decision steps, while Evidence-to-Decision integrates the current observation with accumulated evidence to generate navigation actions or clarification questions. GG-Nav achieves state-of-the-art performance on HM3D ObjectNav, VL-LN, and CoIN, and generalizes zero-shot to unseen real-world environments on a Unitree Go2 robot.",
  authors: [
    { name: "Shaohao Zhu", affiliations: [1, 2] },
    { name: "Wensi Huang", affiliations: [2, 3] },
    { name: "Siqi Zhang", affiliations: [2, 4] },
    { name: "Yuqiang Yang", affiliations: [2] },
    { name: "Meng Wei", affiliations: [2, 5] },
    { name: "Chenyang Wan", affiliations: [1, 2] },
    { name: "Tianle Liu", affiliations: [1] },
    { name: "Tai Wang", affiliations: [2], mark: "†" },
    { name: "Jinming Xu", affiliations: [1], mark: "*" },
  ] satisfies Author[],
  affiliations: [
    "Zhejiang University",
    "Shanghai AI Laboratory",
    "University of Science and Technology of China",
    "Tongji University",
    "The University of Hong Kong",
  ],
  bibtex: `@misc{zhu2026ggnav,
  title        = {GG-Nav: Goal-oriented Grounding Chain-of-Thought
                  Elicits Reasoning in Navigation Foundation Models},
  author       = {Zhu, Shaohao and Huang, Wensi and Zhang, Siqi and
                  Yang, Yuqiang and Wei, Meng and Wan, Chenyang and
                  Liu, Tianle and Wang, Tai and Xu, Jinming},
  year         = {2026},
  note         = {Preprint}
}`,
};

export const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Motivation", href: "#motivation" },
  { label: "Method", href: "#method" },
  { label: "Results", href: "#results" },
  { label: "Demos", href: "#demos" },
  { label: "Cite & Contact", href: "#contact" },
];

export const videos: VideoEntry[] = [
  {
    id: "overview",
    eyebrow: "Method video",
    title: "Method Overview",
    subtitle: "From streaming observations to grounded decisions",
    description:
      "See how GG-Nav recovers transient visual evidence, grounds the intended target, and turns accumulated evidence into navigation decisions.",
    src: new URL("./video/only_method.mp4", import.meta.url).href,
    poster: withBase("assets/teaser.png"),
    facts: ["ObjectNav + IIGN", "Simulation + real world", "Unitree Go2"],
  },
  {
    id: "objectnav",
    eyebrow: "01 / ObjectNav",
    title: "ObjectNav",
    subtitle: "Category-level navigation with precise stopping",
    description:
      "Any sofa is a valid goal. GG-Nav turns transient observations into persistent evidence and reaches the target over an approximately 18 m real-world route.",
    src: new URL("./video/demo1_objectnav.mp4", import.meta.url).href,
    poster: withBase("assets/teaser.png"),
    posterPosition: "23% 88%",
    facts: ["≈ 18 m", "Any valid instance", "Precise stopping"],
  },
  {
    id: "iign-easy",
    eyebrow: "02 / Interactive Navigation",
    title: "Simple IIGN",
    subtitle: "Clarify the intended instance",
    description:
      "The robot grounds nearby chairs, asks targeted clarification questions, preserves the confirmed identity, and stops at chair_3.",
    src: new URL("./video/demo2_iign.mp4", import.meta.url).href,
    poster: withBase("assets/real-world.png"),
    posterPosition: "17% 50%",
    facts: ["3 distractors", "Active dialogue", "Target: chair_3"],
  },
  {
    id: "iign-medium",
    eyebrow: "03 / Evidence Persistence",
    title: "IIGN with Target Disappearance",
    subtitle: "Remember a target after it leaves the observation",
    description:
      "Starting inside a dense cluster of plants, GG-Nav tracks candidate identities and eliminates distractors through grounded interaction.",
    src: new URL("./video/demo3_iign.mp4", import.meta.url).href,
    poster: withBase("assets/real-world.png"),
    posterPosition: "82% 50%",
    facts: ["7 distractors", "Instance tracking", "Target: plant_5"],
  },
  {
    id: "iign-hard",
    eyebrow: "04 / Long-Horizon Navigation",
    title: "Long-Horizon IIGN",
    subtitle: "Preserve grounded evidence over a long journey",
    description:
      "Across a long route and repeated interactions, GG-Nav preserves grounded evidence, rejects earlier candidates, and reaches table_5.",
    src: new URL("./video/demo4_iign.mp4", import.meta.url).href,
    poster: withBase("assets/teaser.png"),
    posterPosition: "79% 86%",
    facts: ["≈ 73 m", "Long horizon", "Target: table_5"],
  },
];

export const benchmarkResults = [
  {
    benchmark: "HM3D",
    task: "ObjectNav",
    score: "72.3",
    unit: "% SR",
    gain: "+3.1",
    accent: "cyan",
  },
  {
    benchmark: "VL-LN",
    task: "Interactive InstanceNav",
    score: "42.0",
    unit: "% SR",
    gain: "+16.6",
    accent: "red",
  },
  {
    benchmark: "CoIN",
    task: "All evaluation splits",
    score: "SOTA",
    unit: "overall",
    gain: "+5.3",
    accent: "yellow",
  },
];

export const realWorldResults = [
  { setting: "ObjectNav", baseline: 20, ggNav: 80 },
  { setting: "IIGN · Easy", baseline: 30, ggNav: 90 },
  { setting: "IIGN · Medium", baseline: 0, ggNav: 60 },
  { setting: "IIGN · Hard", baseline: 0, ggNav: 40 },
];
