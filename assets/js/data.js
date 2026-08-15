export function createDataStore(dataPaths) {
  const dataCache = {};
  let experienceData = [];
  let projectsData = [];
  let ensureDataPromise = null;

  async function loadJson(path) {
    if (Object.prototype.hasOwnProperty.call(dataCache, path)) return dataCache[path];
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      const data = await response.json();
      dataCache[path] = data;
      return data;
    } catch (error) {
      console.warn("data: unable to load", path, error);
      return null;
    }
  }

  async function loadData(key) {
    const path = dataPaths[key];
    if (!path) return [];
    return (await loadJson(path)) || [];
  }

  async function loadProjects() {
    const manifest = await loadData("projects");
    if (Array.isArray(manifest)) return manifest;

    const projectFiles = Array.isArray(manifest.projectFiles) ? manifest.projectFiles : [];
    const manifestUrl = new URL(dataPaths.projects, window.location.href);
    const projects = await Promise.all(
      projectFiles.map((projectFile) => loadJson(new URL(projectFile, manifestUrl).href))
    );
    return projects.filter(Boolean);
  }

  async function loadAllData() {
    experienceData = await loadData("experience");
    projectsData = [...(await loadProjects())].sort((left, right) => {
      const endDateOrder = String(right.sortEnd || "").localeCompare(String(left.sortEnd || ""));
      if (endDateOrder !== 0) return endDateOrder;
      const updatedDateOrder = String(right.sortUpdated || right.sortStart || "").localeCompare(
        String(left.sortUpdated || left.sortStart || "")
      );
      if (updatedDateOrder !== 0) return updatedDateOrder;
      return String(right.sortStart || "").localeCompare(String(left.sortStart || ""));
    });
  }

  function ensureData() {
    if (experienceData.length && projectsData.length) return Promise.resolve();
    if (!ensureDataPromise) {
      ensureDataPromise = loadAllData().finally(() => {
        if (!experienceData.length || !projectsData.length) ensureDataPromise = null;
      });
    }
    return ensureDataPromise;
  }

  return {
    ensureData,
    getExperienceData: () => experienceData,
    getProjectsData: () => projectsData
  };
}
