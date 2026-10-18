const showcase = document.querySelector("#showcase");
const openButtons = [...document.querySelectorAll("[data-showcase-open]")];
const closeButton = document.querySelector("[data-showcase-close]");
const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
let showcaseInitialized = false;

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cubeStacks = [
  ["TypeScript", "typescript/typescript-original.svg"],
  ["JavaScript", "javascript/javascript-original.svg"],
  ["Vue", "vuejs/vuejs-original.svg"],
  ["PHP", "php/php-original.svg"],
  ["Rust", "rust/rust-original.svg"],
  ["CSS", "css3/css3-original.svg"],
  ["Flutter", "flutter/flutter-original.svg"],
  ["Node.js", "nodejs/nodejs-original.svg"],
  ["PostgreSQL", "postgresql/postgresql-original.svg"]
];
let cubeFrame = 0;
let cubeElements = [];

function createTechStream() {
  if (reduceMotion.matches || document.querySelector(".tech-stream")) return;
  const stream = document.createElement("div");
  stream.className = "tech-stream";
  stream.setAttribute("aria-hidden", "true");
  cubeElements = cubeStacks.map(([label, icon], index) => {
    const cube = document.createElement("div");
    cube.className = "tech-cube";
    cube.dataset.index = index;
    ["front", "back", "right", "left", "top", "bottom"].forEach(side => {
      const face = document.createElement("span");
      face.className = `cube-face cube-face--${side}`;
      if (side === "front" || side === "back") {
        const logo = document.createElement("span");
        logo.className = "cube-logo";
        const image = document.createElement("img");
        image.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${icon}`;
        image.alt = "";
        image.width = 32;
        image.height = 32;
        logo.title = label;
        logo.append(image);
        face.append(logo);
      }
      cube.append(face);
    });
    stream.append(cube);
    return cube;
  });
  document.body.append(stream);
  updateTechStream();
}

function updateTechStream() {
  cubeFrame = 0;
  if (!cubeElements.length || reduceMotion.matches) return;
  const maxScroll = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  const scrollProgress = scrollY / maxScroll;
  const compact = innerWidth < 700;
  cubeElements.forEach((cube, index) => {
    const phase = scrollProgress * 1.42 + index * .095 - .12;
    const visible = phase > 0 && phase < 1;
    const y = phase * (innerHeight + 180) - 90;
    const wave = Math.sin((phase * 1.65 + .12) * Math.PI * 2);
    const xCenter = compact ? innerWidth * .77 : innerWidth * .78;
    const amplitude = compact ? innerWidth * .18 : Math.min(innerWidth * .34, 520);
    const x = xCenter + wave * amplitude;
    const size = compact ? 30 + (index % 3) * 4 : 40 + (index % 3) * 6;
    cube.style.setProperty("--size", `${size}px`);
    cube.style.opacity = visible ? String(Math.min(1, (1 - Math.abs(phase - .5) * 2) * 2.8)) : "0";
    cube.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${phase * 620 + index * 31}deg) rotateY(${phase * -760 + index * 47}deg) rotateZ(${phase * 180}deg)`;
  });
}

function requestCubeUpdate() {
  if (!cubeFrame) cubeFrame = requestAnimationFrame(updateTechStream);
}

createTechStream();
window.addEventListener("scroll", requestCubeUpdate, { passive: true });
window.addEventListener("resize", requestCubeUpdate);

const projects = [
  {
    category: "Active products",
    title: "YoCateTin",
    detail: "AI-assisted finance platform that turns daily spending into structured records through familiar chat workflows.",
    impact: "AI · Founder-led product · Active",
    stack: ["AI platform", "Personal finance", "Web application"],
    image: "yocatetin.com.showcase-3.webp",
    alt: "YoCateTin product dashboard and chat interface",
    href: "https://yocatetin.com"
  },
  {
    category: "Active products",
    title: "YoClipper",
    detail: "AI video clipping tool that finds strong moments in long-form recordings and turns them into short-form content.",
    impact: "AI · Video workflow · Active",
    stack: ["AI video", "Short-form content", "Creator tools"],
    visual: "yoclipper",
    href: "https://yocatetin.com/yoclipper"
  },
  {
    category: "Enterprise & international",
    title: "Japan enterprise platform",
    detail: "Modernized a 20-year-old Japanese desktop system into a scalable web application, translating 200+ UI designs and migrating data from MySQL to Oracle 12c.",
    impact: "System modernization · Confidential client",
    stack: ["Laravel 7", "Vue.js", "Laravue", "MySQL", "Oracle 12c"],
    image: "japan-enterprise-platform.jpg",
    alt: "Japanese enterprise scheduling interface during implementation"
  },
  {
    category: "Enterprise & international",
    title: "Casual Chase",
    detail: "Australian recruitment platform with job discovery and subscription payment integration.",
    impact: "Web platform · Australia",
    stack: ["Laravel", "Alpine.js", "Payment API"],
    image: "casual-chase.jpg",
    alt: "Casual Chase recruitment platform homepage"
  },
  {
    category: "Enterprise & international",
    title: "Kulsummarssy",
    detail: "Client-facing gallery and administration platform delivered for a client in Poland.",
    impact: "Web platform · Poland",
    stack: ["React", "Ant Design", "Lumen", "MySQL"],
    image: "kulsummarssy.jpg",
    alt: "Kulsummarssy gallery website presentation"
  },
  {
    category: "Web applications",
    title: "Skripsi Management",
    detail: "Web-based thesis management system for Universitas 17 Agustus 1945 Samarinda.",
    impact: "Education · Workflow platform",
    stack: ["React", "Ant Design", "Lumen", "MySQL"],
    image: "skripsi-management.jpg",
    alt: "Skripsi Management login page for Universitas 17 Agustus 1945 Samarinda"
  },
  {
    category: "Web applications",
    title: "Belanja Malang",
    detail: "E-commerce platform with dedicated customer and administration interfaces.",
    impact: "Commerce · Web platform",
    stack: ["Bootstrap", "React", "Ant Design", "Lumen", "MySQL"],
    image: "belanja-malang.jpg",
    alt: "Belanja Malang e-commerce platform presentation"
  },
  {
    category: "Mobile applications",
    title: "BI NGETROL",
    detail: "Cross-platform monitoring and productivity application developed for Bank Indonesia.",
    impact: "Mobile · Bank Indonesia",
    stack: ["Flutter", "Node.js", "Sequelize"],
    image: "bi-ngetrol.jpg",
    alt: "BI NGETROL mobile application screens"
  },
  {
    category: "Mobile applications",
    title: "SCODEID Attendance & Monitoring",
    detail: "Employee attendance and monitoring application developed for a client.",
    impact: "Mobile · Workforce operations",
    stack: ["Kotlin", "Java", "Lumen", "MySQL"],
    image: "scodeid-attendance.jpg",
    alt: "SCODEID attendance and monitoring application presentation"
  },
  {
    category: "Private client work",
    title: "River / Jetty Monitoring",
    detail: "Mobile workflow for river positions, jetty activity, vessel details, status updates, and operational notifications.",
    impact: "Mobile · PT SAL",
    stack: ["Mobile application", "Enterprise system"],
    image: "river-jetty-monitoring.jpg",
    alt: "River and jetty monitoring mobile workflow for PT SAL",
    video: "sal.webm"
  },
  {
    category: "Additional projects",
    title: "Security & QR Verification",
    detail: "Mobile security workflow covering QR scanning, verification, and one-time-pass access screens.",
    impact: "Mobile · Security workflow",
    stack: ["Mobile application", "QR verification"],
    image: "security-qr-verification.jpg",
    alt: "Mobile security and QR verification application screens"
  },
  {
    category: "Additional projects",
    title: "Leave Management",
    detail: "Localized leave request and attendance workflow built for a Japanese project.",
    impact: "Mobile · Japan",
    stack: ["Flutter", "Riverpod"],
    image: "flutter-leave-management.jpg",
    alt: "Flutter leave management form with localized inputs"
  },
  {
    category: "Additional projects",
    title: "SIMAK",
    detail: "Internal information system for organizing and managing operational activities.",
    impact: "Internal system · Activity management",
    stack: ["Laravel 5.5", "MySQL", "jQuery", "Sass", "Bootstrap"]
  },
  {
    category: "Additional projects",
    title: "Realtime Chat",
    detail: "In-app chat feature for marketplace conversations within Belanja Malang.",
    impact: "Mobile · Marketplace",
    stack: ["Kotlin", "Firebase"],
    image: "realtime-chat-belanja-malang.jpg",
    alt: "Realtime marketplace chat interface in Belanja Malang"
  },
  {
    category: "Additional projects",
    title: "Confidential University Platform",
    detail: "University application with encrypted QR-based operational workflows.",
    impact: "Web platform · Confidential client",
    stack: ["Vue.js", "Node.js", "Sequelize", "MySQL"]
  },
  {
    category: "Products & prototypes",
    title: "Smart Parking",
    detail: "Parking management application exploring a simpler smart-city workflow.",
    impact: "Mobile · Smart city",
    stack: ["Mobile application"],
    image: "yo-parkir.webp",
    alt: "Smart parking app interface"
  },
  {
    category: "Products & prototypes",
    title: "IoT & Embedded Systems",
    detail: "Connected hardware prototypes combining software, sensors, and hands-on electronics.",
    impact: "IoT · Prototyping",
    stack: ["Embedded systems", "Hardware prototyping"],
    image: "iot-project.webp",
    alt: "IoT hardware prototype",
    video: "iot-yogi-solder.webm"
  }
];
const openSourceProjects = [
  {
    name: "Android Kotlin Generator Pattern",
    kind: "Tool",
    description: "Generate Android MVVM code patterns.",
    href: "https://gist.github.com/yogithesymbian/b476ef3640cb4f1343ef3816064be8be"
  },
  {
    name: "Yo WebP Converter",
    kind: "VS Code extension",
    description: "Convert images in a folder and its subfolders to WebP.",
    href: "https://marketplace.visualstudio.com/items?itemName=YoLicenses.yo-webp"
  },
  {
    name: "Yo Netwatch",
    kind: "Rust library",
    description: "A library for network monitoring.",
    href: "https://crates.io/crates/yo_netwatch"
  },
  {
    name: "Bug Hunting Penetration Test RGB Hat",
    kind: "Tool",
    description: "A security testing tool for bug bounty work.",
    href: "https://github.com/yogithesymbian/bug-hunting-penetration-rgb-hat"
  },
  {
    name: "Sequelize CRUD Generator",
    kind: "API",
    description: "Generate CRUD operations for Sequelize and MySQL.",
    href: "https://github.com/pemrogrammer/api-nodejs-sequelize-jwt-mysql-generator"
  }
];

const clientLogos = [
  { name: "Astra", file: "assets/client_p/astra.webp" },
  { name: "Digitalent", file: "assets/client_p/digitalent.webp" },
  { name: "PF Soft", file: "assets/client_p/pfsoft.webp" },
  { name: "PT IMT", file: "assets/client_p/ptimt.webp" },
  { name: "PT SAL", file: "assets/client_p/ptsal.webp" },
  { name: "PT Samatech", file: "assets/client_p/ptsama.webp" },
  { name: "Restu Ibu Hospital", file: "assets/client_p/restuibuhospitalbpn.webp" },
  { name: "Scodeid", file: "assets/client_p/scodeid.svg" },
  { name: "Politeknik Negeri Samarinda", file: "assets/client_p/partner/polnes.webp" },
  { name: "Universitas Mulawarman", file: "assets/client_p/partner/unmul.webp" },
  { name: "Universitas 17 Agustus Samarinda", file: "assets/client_p/partner/untag.webp" }
];

function makeProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  let media;
  if (project.visual === "yoclipper") {
    media = document.createElement("div");
    media.className = "project-visual yoclipper-visual";
    media.setAttribute("role", "img");
    media.setAttribute("aria-label", "YoClipper AI video upload and clipping interface");
    media.innerHTML = `
      <span class="visual-kicker">YoClipper</span>
      <strong>Clip viral videos</strong>
      <span>Upload video, let AI find the moments.</span>
      <span class="visual-input">Paste URL (YouTube, Threads, IG…) <b>↵</b></span>
      <span class="visual-platforms">YouTube · TikTok · Instagram</span>
    `;
  } else if (project.video) {
    media = document.createElement("video");
    media.controls = true;
    media.preload = "none";
    if (project.image) media.dataset.poster = `assets/favorite_projects/${project.image}`;
    media.setAttribute("aria-label", `${project.title} video`);
    const source = document.createElement("source");
    source.dataset.src = `assets/favorite_projects/${project.video}`;
    source.type = "video/webm";
    media.append(source, "Your browser does not support WebM video.");
  } else if (project.image) {
    media = document.createElement("img");
    media.src = `assets/favorite_projects/${project.image}`;
    media.alt = project.alt;
    media.loading = "lazy";
    media.decoding = "async";
  }
  const copy = document.createElement("div");
  copy.className = "project-copy";
  const title = document.createElement("h3");
  title.textContent = project.title;
  const detail = document.createElement("p");
  detail.textContent = project.detail;
  const impact = document.createElement("p");
  impact.className = "project-impact";
  impact.textContent = project.impact;
  copy.append(title, detail, impact);
  if (project.stack?.length) {
    const stack = document.createElement("ul");
    stack.className = "project-stack";
    stack.setAttribute("aria-label", "Technologies");
    project.stack.forEach(item => {
      const technology = document.createElement("li");
      technology.textContent = item;
      stack.append(technology);
    });
    copy.append(stack);
  }
  if (project.href) {
    const link = document.createElement("a");
    link.className = "project-link";
    link.href = project.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open live product ↗";
    copy.append(link);
  }
  if (media) card.append(media);
  card.append(copy);
  return card;
}

function makeOpenSourceCard(project) {
  const link = document.createElement("a");
  link.className = "source-card";
  link.href = project.href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const heading = document.createElement("div");
  heading.className = "source-heading";
  const title = document.createElement("h3");
  title.textContent = project.name;
  const kind = document.createElement("span");
  kind.className = "source-kind";
  kind.textContent = project.kind;
  heading.append(title, kind);

  const description = document.createElement("p");
  description.textContent = project.description;
  const external = document.createElement("span");
  external.className = "source-external";
  external.setAttribute("aria-hidden", "true");
  external.textContent = "↗";
  link.append(heading, description, external);
  return link;
}

function makeClientCard(client) {
  const card = document.createElement("div");
  card.className = "client-card";
  const image = document.createElement("img");
  image.src = client.file;
  image.alt = client.name;
  image.loading = "lazy";
  image.decoding = "async";
  const label = document.createElement("span");
  label.textContent = client.name;
  card.append(image, label);
  return card;
}

function initializeShowcase() {
  if (showcaseInitialized) return;
  const projectPanel = document.querySelector('[data-panel="projects"]');
  const projectIntro = document.createElement("p");
  projectIntro.className = "showcase-intro";
  // projectIntro.textContent = "Selected client, product, and private work across enterprise systems, web platforms, mobile applications, and connected hardware.";
  projectPanel.append(projectIntro);
  [...new Set(projects.map(project => project.category))].forEach(category => {
    const group = document.createElement("section");
    group.className = "project-group";
    const heading = document.createElement("h3");
    heading.className = "project-group-title";
    heading.textContent = category;
    const projectGrid = document.createElement("div");
    projectGrid.className = "project-grid";
    projects.filter(project => project.category === category)
      .forEach(project => projectGrid.append(makeProjectCard(project)));
    group.append(heading, projectGrid);
    projectPanel.append(group);
  });

  const clientGrid = document.createElement("div");
  clientGrid.className = "client-grid";
  clientLogos.forEach(client => clientGrid.append(makeClientCard(client)));
  document.querySelector('[data-panel="clients"]').append(clientGrid);

  const sourceList = document.createElement("div");
  sourceList.className = "source-list";
  openSourceProjects.forEach(project => sourceList.append(makeOpenSourceCard(project)));
  document.querySelector('[data-panel="opensource"]').append(sourceList);
  showcaseInitialized = true;
}

function activateShowcaseMedia() {
  showcase.querySelectorAll("video").forEach(video => {
    if (video.dataset.poster) video.poster = video.dataset.poster;
    const sources = video.querySelectorAll("source[data-src]");
    sources.forEach(source => {
      source.src = source.dataset.src;
      source.removeAttribute("data-src");
    });
    if (sources.length) video.load();
  });
}

initializeShowcase();
openButtons.forEach(button => button.addEventListener("click", () => {
  activateShowcaseMedia();
  showcase.showModal();
}));
closeButton.addEventListener("click", () => showcase.close());
showcase.addEventListener("click", event => {
  if (event.target === showcase) showcase.close();
});
function selectTab(tab) {
  const selected = tab.dataset.tab;
  tabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach(panel => { panel.hidden = panel.dataset.panel !== selected; });
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", event => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (tabs.indexOf(tab) + direction + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    selectTab(tabs[nextIndex]);
  });
});
