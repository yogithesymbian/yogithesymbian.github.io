const showcase = document.querySelector("#showcase");
const openButtons = [...document.querySelectorAll("[data-showcase-open]")];
const closeButton = document.querySelector("[data-showcase-close]");
const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
let showcaseInitialized = false;

const projects = [
  {
    title: "YoCateTin",
    detail: "AI assisted expense tracking platform",
    image: "yocatetin.com.showcase-3.webp",
    alt: "YoCateTin product dashboard and chat interface"
  },
  {
    title: "SAL maritime operations",
    detail: "Digital tools for port and fleet workflows",
    image: "sal-poster.webp",
    alt: "SAL maritime operations dashboard",
    video: "sal.webm"
  },
  {
    title: "Smart parking",
    detail: "Parking management app project",
    image: "yo-parkir.webp",
    alt: "Smart parking app interface"
  },
  {
    title: "IoT & embedded systems",
    detail: "Hardware prototypes and connected systems",
    image: "iot-project.webp",
    alt: "IoT project prototype",
    video: "iot-yogi-solder.webm"
  },
  {
    title: "IoT prototype demo",
    detail: "Connected hardware project walkthrough",
    image: "iot1.webp",
    alt: "IoT project interface",
    video: "iot-yogithesymbian.webm"
  },
  {
    title: "Academic project",
    detail: "Informatics Engineering thesis project",
    image: "skripsi-untag.webp",
    alt: "Thesis project interface"
  },
  {
    title: "Tokyo project clip",
    detail: "Video showcase",
    video: "tokyo-cert.webm"
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
  if (project.video) {
    media = document.createElement("video");
    media.controls = true;
    media.preload = "none";
    if (project.image) media.dataset.poster = `assets/favorite_projects/${project.image}`;
    media.setAttribute("aria-label", `${project.title} video`);
    const source = document.createElement("source");
    source.dataset.src = `assets/favorite_projects/${project.video}`;
    source.type = "video/webm";
    media.append(source, "Your browser does not support WebM video.");
  } else {
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
  copy.append(title, detail);
  card.append(media, copy);
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
  const projectGrid = document.createElement("div");
  projectGrid.className = "project-grid";
  projects.forEach(project => projectGrid.append(makeProjectCard(project)));
  document.querySelector('[data-panel="projects"]').append(projectGrid);

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
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const selected = tab.dataset.tab;
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.panel !== selected; });
  });
});
