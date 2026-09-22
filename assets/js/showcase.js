const showcase = document.querySelector("#showcase");
const openButton = document.querySelector("[data-showcase-open]");
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
const clientLogos = [
  { name: "Astra", file: "assets/client_p/astra.webp" },
  { name: "Digitalent", file: "assets/client_p/digitalent.webp" },
  { name: "PF Soft", file: "assets/client_p/pfsoft.webp" },
  { name: "PT IMT", file: "assets/client_p/ptimt.webp" },
  { name: "PT SAL", file: "assets/client_p/ptsal.webp" },
  { name: "PT Samatech", file: "assets/client_p/ptsama.webp" },
  { name: "Scodeid", file: "assets/client_p/scodeid.svg" },
  { name: "POLNES", file: "assets/client_p/partner/polnes.webp" },
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
    if (project.image) media.poster = `assets/favorite_projects/${project.image}`;
    media.setAttribute("aria-label", `${project.title} video`);
    const source = document.createElement("source");
    source.src = `assets/favorite_projects/${project.video}`;
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
  showcaseInitialized = true;
}

openButton.addEventListener("click", () => {
  initializeShowcase();
  showcase.showModal();
});
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
