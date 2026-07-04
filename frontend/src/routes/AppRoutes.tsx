import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Layout } from "../components/layout/Layout";
import { About } from "../pages/About";
import { Achievements } from "../pages/Achievements";
import { Admin } from "../pages/Admin";
import { Blog } from "../pages/Blog";
import { BlogDetailsPage } from "../pages/BlogDetailsPage";
import { Contact } from "../pages/Contact";
import { ExperiencePage } from "../pages/ExperiencePage";
import { Home } from "../pages/Home";
import { Journey } from "../pages/Journey";
import { NotFound } from "../pages/NotFound";
import { ProjectDetailsPage } from "../pages/ProjectDetailsPage";
import { Projects } from "../pages/Projects";
import { ProtectedRoute } from "./ProtectedRoute";
import { Publications } from "../pages/Publications";
import { SkillsPage } from "../pages/SkillsPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<Home />} index />
          <Route element={<About />} path="about" />
          <Route element={<Journey />} path="journey" />
          <Route element={<Projects />} path="projects" />
          <Route element={<ProjectDetailsPage />} path="projects/:slug" />
          <Route element={<Publications />} path="research" />
          <Route element={<Publications />} path="publications" />
          <Route element={<ExperiencePage />} path="experience" />
          <Route element={<SkillsPage />} path="skills" />
          <Route element={<Achievements />} path="achievements" />
          <Route element={<Blog />} path="blog" />
          <Route element={<BlogDetailsPage />} path="blog/:slug" />
          <Route element={<Contact />} path="contact" />
          <Route element={<Admin />} path="admin" />
          <Route
            element={
              <ProtectedRoute>
                <Admin dashboard />
              </ProtectedRoute>
            }
            path="admin/dashboard"
          />
          <Route element={<NotFound />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
