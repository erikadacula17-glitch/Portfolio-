// Replace this with your GitHub username to show your latest public repositories.
const GITHUB_USERNAME = "yourusername";

const projectList = document.querySelector("#project-list");
const githubStatus = document.querySelector("#github-status");
const githubRepos = document.querySelector("#github-repos");

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error("Could not load projects.");
    const projects = await response.json();
    if (!Array.isArray(projects) || projects.length === 0) throw new Error("No projects found.");

    projectList.replaceChildren();
    projects.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";
      const title = document.createElement("h3");
      title.textContent = project.title;
      const description = document.createElement("p");
      description.textContent = project.description;
      const tech = document.createElement("p");
      tech.className = "tech";
      tech.textContent = `Technologies: ${project.technologies.join(", ")}`;
      const role = document.createElement("p");
      role.textContent = `Role: ${project.role}`;
      const link = document.createElement("a");
      link.href = project.link || "#";
      link.textContent = "View project ↗";
      if (project.link && project.link !== "#") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.addEventListener("click", (event) => event.preventDefault());
        link.textContent = "Add your project link";
      }
      card.append(title, description, tech, role, link);
      projectList.append(card);
    });
  } catch (error) {
    projectList.textContent = "Projects could not be loaded. Please check data/projects.json and run this site using Live Server.";
    console.error(error);
  }
}

async function loadGitHubRepos() {
  if (!GITHUB_USERNAME || GITHUB_USERNAME === "yourusername") {
    githubStatus.textContent = "To display your repositories, replace “yourusername” in js/script.js with your GitHub username.";
    return;
  }
  githubStatus.textContent = "Loading repositories…";
  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?sort=updated&per_page=5`);
    if (!response.ok) throw new Error("GitHub API request failed.");
    const repos = await response.json();
    githubRepos.replaceChildren();
    if (!repos.length) {
      githubStatus.textContent = "No public repositories found for this account yet.";
      return;
    }
    repos.forEach((repo) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = repo.name;
      const language = document.createElement("small");
      language.textContent = `Main language: ${repo.language || "Not specified"}`;
      item.append(link, language);
      githubRepos.append(item);
    });
    githubStatus.textContent = "Your 5 most recently updated public repositories:";
  } catch (error) {
    githubStatus.textContent = "GitHub data is unavailable right now. Check your username, internet connection, or try again later.";
    console.error(error);
  }
}

const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#form-status");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  status.textContent = `Thank you, ${form.elements.name.value.trim()}! This demo form was validated, but no email was sent.`;
  form.reset();
});

document.querySelector("#year").textContent = new Date().getFullYear();
loadProjects();
loadGitHubRepos();
