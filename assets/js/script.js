window.__PORTFOLIO_CONFIG__ = {
  dataPaths: {
    experience: "./assets/data/experience.json",
    projects: "./assets/data/projects.bundle.json"
  }
};

import("./app.js").catch((error) => {
  console.error("portfolio: unable to start runtime", error);
});
