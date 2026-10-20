"use strict";

(() => {
  const $ = (id) => document.getElementById(id);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  const state = {
    mode: local ? "local" : "github", schema: null, config: null,
    content: null, saved: null, revision: "", csrf: "", token: "",
    repository: "", branch: "", section: "dashboard", busy: false, dirty: false,
    session: null, username: "", fieldId: 0,
  };
  const imagePreviews = new Map();
  const descriptions = {
    settings: "The name, navigation identity, and footer shared across your pages.",
    profile: "Your introduction, contact details, photo, and social links.",
    home: "Update your headline, highlights, services, and invitation to connect.",
    about: "Tell your story and manage your education, strengths, and next steps.",
    pageHeadings: "Edit the title and introduction on each portfolio page.",
    projects: "Add, edit, or remove projects. Only projects marked Published appear on the website.",
    blogs: "Write a post, keep it as a draft, preview it, and publish when you’re ready.",
    publications: "Manage research, publications, and conference presentations.",
    experience: "Keep your work history and experience up to date.",
    skills: "Manage skill categories and your self-assessed levels.",
    journey: "Add, reorder, or remove milestones in your timeline.",
    achievements: "Manage achievements, statistics, and recognition.",
    customPages: "Create additional pages. Draft pages are visible only in this editor.",
  };

  function element(tag, attributes = {}, text = "") {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      if (key === "class") node.className = value;
      else if (key === "checked" || key === "disabled" || key === "open") node[key] = value;
      else node.setAttribute(key, value);
    }
    if (text !== "") node.textContent = text;
    return node;
  }
  function button(label, handler, className = "secondary") {
    const node = element("button", { type: "button", class: className }, label);
    node.addEventListener("click", handler);
    return node;
  }
  function notice(message, error = false, href = "") {
    $("notice").replaceChildren(document.createTextNode(message));
    $("notice").className = "notice" + (error ? " error" : "");
    $("notice").hidden = !message;
    if (href) {
      $("notice").append(element("a", { href, target: "_blank", rel: "noopener noreferrer" }, "View progress ↗"));
    }
  }
  function markDirty() {
    state.dirty = JSON.stringify(state.content) !== state.saved;
    $("save").disabled = state.busy || !state.dirty;
    $("save-state").textContent = state.dirty ? "Unsaved changes" : "All changes saved";
  }
  function getAt(path) { return path.reduce((value, key) => value[key], state.content); }
  function setAt(path, value) {
    const parent = getAt(path.slice(0, -1));
    parent[path.at(-1)] = value;
    markDirty();
  }
  function defaults(schema) {
    if (schema.type === "object") return Object.fromEntries(Object.entries(schema.fields).map(([key, child]) => [key, defaults(child)]));
    if (schema.type === "array") return [];
    return schema.default ?? "";
  }
  function validateShape(value, schema, path = "Content") {
    if (schema.type === "object") {
      if (!value || Array.isArray(value) || typeof value !== "object" ||
          Object.keys(value).sort().join("|") !== Object.keys(schema.fields).sort().join("|")) {
        throw new Error(`${path}: this backup does not match the portfolio’s content format.`);
      }
      for (const [key, child] of Object.entries(schema.fields)) validateShape(value[key], child, `${path} / ${child.label}`);
    } else if (schema.type === "array") {
      if (!Array.isArray(value) || value.length > (schema.maxItems || 200)) throw new Error(`${path}: too many items or invalid list.`);
      value.forEach((child) => validateShape(child, schema.item, path));
    } else if (schema.type === "number") {
      if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error(`${path}: enter a number between 0 and 100.`);
    } else if (schema.type === "boolean") {
      if (typeof value !== "boolean") throw new Error(`${path}: invalid checkbox value.`);
    } else {
      if (typeof value !== "string" || value.length > 100_000 || value.includes("\0")) throw new Error(`${path}: invalid or excessively long text.`);
      if (schema.required && !value.trim()) throw new Error(`${path} is required.`);
      if (schema.type === "select" && !schema.options.includes(value)) throw new Error(`${path}: choose a valid status.`);
      if (schema.type === "date" && value) {
        const date = new Date(value + "T00:00:00Z");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error(`${path}: enter a valid date.`);
      }
      if (schema.type === "image" && value) {
        let valid = !/[\x00-\x20\\]/.test(value) && value.startsWith("assets/") && !value.split(/[?#]/)[0].split("/").includes("..");
        try { valid ||= !/[\x00-\x20\\]/.test(value) && new URL(value).protocol === "https:"; } catch {}
        if (!valid) throw new Error(`${path}: use an assets/ path or HTTPS image URL.`);
      }
    }
  }
  function validateDocument() {
    validateShape(state.content, state.schema);
    for (const group of ["projects", "blogs", "customPages"]) {
      const seen = new Set();
      for (const item of state.content[group]) {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || item.slug.length > 100) {
          throw new Error(`${item.title || group}: URL names must use lowercase letters, numbers, and hyphens.`);
        }
        if (seen.has(item.slug)) throw new Error(`${group}: the URL name "${item.slug}" is already used.`);
        seen.add(item.slug);
      }
    }
    if (!/^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(state.content.profile.email)) {
      throw new Error("Profile: enter a valid email address.");
    }
    if (new TextEncoder().encode(JSON.stringify(state.content)).length > 2_000_000) throw new Error("The content file is too large.");
  }
  async function localRequest(path, body) {
    const response = await fetch("/api/admin/" + path, {
      method: body ? "POST" : "GET", cache: "no-store", credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json", "X-Portfolio-Admin": "1", "X-CSRF-Token": state.csrf } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(result.error || "The local admin server is unavailable. Start it with python3 cms/server.py.");
      error.status = response.status;
      throw error;
    }
    return result;
  }
  async function github(path, options = {}) {
    const response = await fetch("https://api.github.com" + path, {
      ...options, cache: "no-store",
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + state.token, "X-GitHub-Api-Version": "2022-11-28", ...(options.body ? { "Content-Type": "application/json" } : {}) },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 409) throw new Error("Someone else changed this content. Export your unsaved work, then reload before saving.");
      if (response.status === 401) throw new Error("Your GitHub token is invalid or expired. Sign out and use a new token.");
      if (response.status === 403) throw new Error("GitHub did not allow this action. Check the token’s Contents write permission and the branch’s protection rules.");
      if (response.status === 404) throw new Error("The repository or CMS content was not found. Upload this project first and give the token access to the selected repository.");
      throw new Error(result.message || "GitHub could not complete the request.");
    }
    return result;
  }
  const repositoryPath = () => "/repos/" + state.repository.split("/").map(encodeURIComponent).join("/");
  function decode64(value) {
    return new TextDecoder().decode(Uint8Array.from(atob(value.replace(/\s/g, "")), (ch) => ch.charCodeAt(0)));
  }
  function encode64(value) {
    const bytes = new TextEncoder().encode(value);
    let result = "";
    for (let i = 0; i < bytes.length; i += 16384) result += String.fromCharCode(...bytes.subarray(i, i + 16384));
    return btoa(result);
  }
  async function loadContent() {
    if (state.mode === "local") {
      const result = await localRequest("content");
      state.content = result.content; state.revision = result.revision;
    } else {
      let file = await github(repositoryPath() + "/contents/" + state.config.contentPath + "?ref=" + encodeURIComponent(state.branch));
      state.revision = file.sha;
      if (file.encoding !== "base64") file = await github(repositoryPath() + "/git/blobs/" + file.sha);
      state.content = JSON.parse(decode64(file.content));
    }
    validateDocument();
    state.saved = JSON.stringify(state.content);
    state.dirty = false;
    showStudio();
  }
  async function save() {
    if (state.busy || !state.dirty) return;
    state.busy = true; $("save").disabled = true; $("save").textContent = "Saving…";
    try {
      validateDocument();
      const snapshot = JSON.stringify(state.content);
      if (state.mode === "local") {
        const result = await localRequest("content", { content: JSON.parse(snapshot), revision: state.revision });
        state.revision = result.revision;
        notice(result.message);
      } else {
        const result = await github(repositoryPath() + "/contents/" + state.config.contentPath, {
          method: "PUT", body: { message: "Update portfolio content", content: encode64(JSON.stringify(JSON.parse(snapshot), null, 2) + "\n"), sha: state.revision, branch: state.branch },
        });
        state.revision = result.content.sha;
        notice("Changes saved to GitHub. The Pages workflow will rebuild the public site; check its status before sharing.", false, "https://github.com/" + state.repository + "/actions");
      }
      state.saved = snapshot;
      renderNavigation();
    } catch (error) { notice(error.message, true); }
    finally { state.busy = false; $("save").textContent = "Save changes"; markDirty(); }
  }
  async function upload(file) {
    if (!file || file.size > 5_000_000) throw new Error("Choose a PNG, JPEG, or WebP image smaller than 5 MB.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const png = bytes.length > 8 && bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10";
    const jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const webp = new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
    if (!png && !jpg && !webp) throw new Error("Choose a PNG, JPEG, or WebP image.");
    let binary = "";
    for (let i = 0; i < bytes.length; i += 16384) binary += String.fromCharCode(...bytes.subarray(i, i + 16384));
    const data = btoa(binary);
    if (state.mode === "local") return (await localRequest("upload", { data })).path;
    const path = "assets/uploads/" + crypto.randomUUID().replaceAll("-", "") + (png ? ".png" : jpg ? ".jpg" : ".webp");
    await github(repositoryPath() + "/contents/" + path, {
      method: "PUT", body: { message: "Upload portfolio image", branch: state.branch, content: data },
    });
    return path;
  }
  function imageURL(value) {
    if (!value) return "";
    if (imagePreviews.has(value)) return imagePreviews.get(value);
    if (/^https:\/\/[^\s]+$/.test(value)) return value;
    if (!/^assets\/[a-zA-Z0-9/_.-]+$/.test(value) || value.includes("..")) return "";
    return "../" + value;
  }
  function preview(item) {
    const article = $("preview-content");
    article.replaceChildren(element("p", { class: "eyebrow" }, "Preview · " + item.status), element("h1", {}, item.title || "Untitled"));
    if (item.cover_image && imageURL(item.cover_image)) article.append(element("img", { src: imageURL(item.cover_image), alt: "" }));
    article.append(element("p", { class: "muted" }, item.excerpt || item.description || ""));
    for (const paragraph of (item.content || "").split(/\n\s*\n/)) article.append(element("p", {}, paragraph));
    $("preview-dialog").showModal();
  }
  function titleOf(value, index) {
    if (typeof value !== "object" || value === null) return String(value || `Item ${index + 1}`);
    return value.title || value.name || value.role || value.stage || value.label || value.institution || value.text || `Item ${index + 1}`;
  }
  function field(schema, path, initial, expanded = false) {
    const key = path.at(-1);
    if (schema.type === "object") {
      const wrapper = element("div", { class: "object-fields" });
      for (const [name, child] of Object.entries(schema.fields)) {
        if (child.type === "object") {
          const group = element("details", { class: "object-group" });
          group.append(element("summary", {}, child.label), field(child, [...path, name], initial[name]));
          wrapper.append(group);
        } else wrapper.append(field(child, [...path, name], initial[name]));
      }
      return wrapper;
    }
    if (schema.type === "array") {
      const wrapper = element("section", { class: "array-field" });
      if (path.length > 1) wrapper.append(element("h3", {}, schema.label));
      if (!initial.length) wrapper.append(element("p", { class: "empty-list" }, "No items yet. Add one below."));
      initial.forEach((value, index) => {
        const itemPath = [...path, index];
        const detail = element("details", { class: "array-item", open: expanded || (index === initial.length - 1 && window.newItemPath === JSON.stringify(path)) });
        const summary = element("summary", {}, titleOf(value, index));
        if (value && typeof value === "object" && ["draft", "published"].includes(value.status)) summary.append(element("span", { class: "badge " + value.status }, value.status));
        detail.append(summary, field(schema.item, itemPath, value));
        const actions = element("div", { class: "item-actions" });
        if (["blogs", "customPages"].includes(path[0]) && path.length === 1) {
          actions.append(button("Preview", () => preview(getAt(itemPath))));
          const nextStatus = value.status === "published" ? "draft" : "published";
          actions.append(button(nextStatus === "draft" ? "Move to draft" : "Publish", async () => {
            if (!confirm((nextStatus === "draft" ? "Unpublish this item" : "Publish this item") + " and save all pending changes?")) return;
            setAt([...itemPath, "status"], nextStatus);
            renderEditor(); await save();
          }));
        }
        const move = (offset) => {
          if (index + offset < 0 || index + offset >= initial.length) return;
          const items = getAt(path); [items[index], items[index + offset]] = [items[index + offset], items[index]];
          markDirty(); renderEditor();
        };
        const up = button("Move up", () => move(-1)); up.disabled = index === 0;
        const down = button("Move down", () => move(1)); down.disabled = index === initial.length - 1;
        actions.append(up, down, button("Delete", () => {
          if (!confirm("Delete this item? Save changes to apply the deletion to the website.")) return;
          getAt(path).splice(index, 1); markDirty(); renderEditor(); renderNavigation();
        }, "danger"));
        detail.append(actions); wrapper.append(detail);
      });
      const add = button("＋ Add " + (path[0] === "blogs" && path.length === 1 ? "blog post" : "item"), () => {
        const value = defaults(schema.item);
        if (value && typeof value === "object" && !Array.isArray(value)) {
          if ("status" in value && ["blogs", "customPages"].includes(path[0])) value.status = "draft";
          if ("published_at" in value) value.published_at = new Date().toISOString().slice(0, 10);
          if ("slug" in value) value.slug = "new-" + crypto.randomUUID().slice(0, 8);
          if ("title" in value) value.title = path[0] === "blogs" ? "Untitled post" : "New item";
        }
        getAt(path).push(value); window.newItemPath = JSON.stringify(path);
        markDirty(); renderEditor(); renderNavigation(); window.newItemPath = null;
      }, "secondary add-item");
      add.disabled = initial.length >= (schema.maxItems || 200);
      wrapper.append(add);
      if (schema.maxItems) wrapper.append(element("p", { class: "help" }, `Up to ${schema.maxItems} items fit this part of the layout.`));
      return wrapper;
    }
    const wide = ["textarea", "image"].includes(schema.type);
    const wrapper = element("div", { class: "field" + (wide ? " field-wide" : "") + (schema.type === "boolean" ? " field-checkbox" : "") + (schema.type === "image" ? " field-image" : "") });
    const id = "edit-field-" + ++state.fieldId;
    const label = element("label", { for: id }, schema.label + (schema.required ? " *" : ""));
    let input;
    if (schema.type === "textarea") input = element("textarea", { id, rows: key === "content" ? "14" : "4" });
    else if (schema.type === "select") {
      input = element("select", { id });
      for (const option of schema.options) input.append(element("option", { value: option }, option === "published" ? "Published — visible on website" : "Draft — not shown on website"));
    } else input = element("input", { id, type: schema.type === "boolean" ? "checkbox" : schema.type === "number" ? "number" : schema.type === "date" ? "date" : "text" });
    input.dataset.path = JSON.stringify(path);
    if (schema.type === "number") { input.min = 0; input.max = 100; }
    if (schema.required) input.required = true;
    if (schema.type === "boolean") {
      input.checked = initial; label.prepend(input); wrapper.append(label);
    } else { input.value = initial; wrapper.append(label, input); }
    input.addEventListener("input", () => {
      setAt(path, schema.type === "boolean" ? input.checked : schema.type === "number" ? Number(input.value) : input.value);
    });
    if (key === "content") wrapper.append(element("p", { class: "help" }, "Write plain text. Leave a blank line between paragraphs."));
    if (key === "slug") wrapper.append(element("p", { class: "help" }, "This is part of the page address. Use lowercase letters, numbers, and hyphens. Changing it removes the old address."));
    if (schema.type === "image") {
      if (imageURL(initial)) wrapper.append(element("img", { class: "image-preview", src: imageURL(initial), alt: "Current image preview" }));
      const fileId = id + "-upload";
      const file = element("input", { id: fileId, type: "file", accept: "image/png,image/jpeg,image/webp", hidden: "" });
      const uploadLabel = element("label", { for: fileId, class: "secondary upload-label" }, "Upload image");
      file.addEventListener("change", async () => {
        try {
          uploadLabel.textContent = "Uploading…";
          const pathValue = await upload(file.files[0]);
          imagePreviews.set(pathValue, URL.createObjectURL(file.files[0]));
          setAt(path, pathValue); renderEditor();
          notice("Image uploaded. Save changes to use it on the website.");
        } catch (error) { notice(error.message, true); }
        finally { uploadLabel.textContent = "Upload image"; }
      });
      wrapper.append(file, uploadLabel, element("p", { class: "help" }, "PNG, JPEG, or WebP, up to 5 MB. You can also enter an HTTPS image URL."));
    }
    return wrapper;
  }
  function renderNavigation() {
    const nav = $("section-nav"); nav.replaceChildren();
    const entries = [["dashboard", "Overview"], ...Object.entries(state.schema.fields).map(([key, schema]) => [key, schema.label])];
    for (const [key, label] of entries) {
      const node = button(label, () => { state.section = key; renderNavigation(); renderEditor(); $("editor").focus(); }, "section-button");
      if (key === state.section) node.setAttribute("aria-current", "page");
      if (Array.isArray(state.content?.[key])) node.append(element("span", { class: "section-count" }, state.content[key].length));
      nav.append(node);
    }
  }
  function renderEditor() {
    const main = $("editor"); main.replaceChildren(); state.fieldId = 0;
    const heading = element("div", { class: "page-heading" });
    if (state.section === "dashboard") {
      heading.append(element("p", { class: "eyebrow" }, "Your portfolio"), element("h1", {}, "Make it yours."), element("p", {}, "Everything you need to keep your website current, in one place."));
      const stats = element("div", { class: "dashboard-grid" });
      for (const [count, label] of [[state.content.blogs.filter(b => b.status === "published").length, "Published posts"], [state.content.blogs.filter(b => b.status === "draft").length, "Draft posts"], [state.content.projects.length, "Projects"]]) {
        const card = element("div", { class: "stat-card" }); card.append(element("strong", {}, count), element("p", {}, label)); stats.append(card);
      }
      const welcome = element("section", { class: "welcome-panel" });
      welcome.append(element("h2", {}, "What would you like to share?"), element("p", {}, "Choose a section to edit your content. Save changes to update the website. A blog post stays off the public pages until you publish it."));
      const actions = element("div", { class: "button-row" });
      actions.append(button("Manage blog posts", () => { state.section = "blogs"; renderNavigation(); renderEditor(); }, "primary"), button("Edit my profile", () => { state.section = "profile"; renderNavigation(); renderEditor(); }));
      welcome.append(actions); main.append(heading, stats, welcome);
    } else {
      heading.append(element("p", { class: "eyebrow" }, "Content editor"), element("h1", {}, state.schema.fields[state.section].label), element("p", {}, descriptions[state.section] || ""));
      main.append(heading, field(state.schema.fields[state.section], [state.section], state.content[state.section]));
    }
    markDirty();
  }
  function showStudio() {
    $("login-screen").hidden = true; $("studio").hidden = false;
    $("identity").textContent = state.username;
    $("connection-label").textContent = state.mode === "local" ? "Local website" : "GitHub · " + state.repository;
    $("change-password").hidden = state.mode !== "local";
    renderNavigation(); renderEditor();
  }
  async function signOut() {
    if (state.dirty && !confirm("Sign out and discard unsaved changes?")) return;
    try { if (state.mode === "local") await localRequest("logout", {}); }
    catch (error) { if (error.status !== 401) { notice(error.message, true); return; } }
    state.token = ""; state.csrf = ""; state.content = null; state.saved = null; state.dirty = false;
    $("editor").replaceChildren(); $("section-nav").replaceChildren();
    for (const url of imagePreviews.values()) URL.revokeObjectURL(url);
    imagePreviews.clear();
    $("studio").hidden = true; $("login-screen").hidden = false;
    $("password").value = ""; $("github-token").value = ""; $("notice").hidden = true;
    await initialiseLogin();
  }
  async function initialiseLogin() {
    $("login-error").textContent = ""; $("login-form").hidden = true;
    $("local-fields").hidden = state.mode !== "local"; $("github-fields").hidden = state.mode !== "github";
    if (state.mode === "local") {
      try {
        state.session = await localRequest("session");
        if (state.session.authenticated) {
          state.username = state.session.username; state.csrf = state.session.csrf; return await loadContent();
        }
        const setup = state.session.setup_required;
        $("login-title").textContent = setup ? "Create your admin account." : "Welcome back.";
        $("login-description").textContent = setup ? "Choose a username and password to manage this website on your computer." : "Log in to edit your portfolio and manage your writing.";
        $("login-submit").textContent = setup ? "Create account" : "Log in";
        $("password-help").hidden = !setup; $("password").minLength = setup ? 12 : 1;
        $("password").autocomplete = setup ? "new-password" : "current-password";
        $("username").required = true; $("password").required = true; $("github-token").required = false;
        $("connection-help").textContent = "Local changes appear immediately on localhost. GitHub Pages uses the separate GitHub connection after deployment.";
      } catch (error) {
        $("login-title").textContent = "Start the admin server.";
        $("login-description").textContent = "Run python3 cms/server.py in the project folder, then refresh this page.";
        $("login-error").textContent = error.message;
        return;
      }
    } else {
      if (location.protocol !== "https:") {
        $("login-title").textContent = "Use HTTPS to log in.";
        $("login-description").textContent = "Open the secure GitHub Pages URL to use the online editor.";
        return;
      }
      $("login-title").textContent = "Connect to GitHub.";
      $("login-description").textContent = "Sign in with a repository access token to manage your hosted portfolio.";
      $("repository").value = state.config.repository; $("branch").value = state.config.branch;
      $("github-token").required = true; $("username").required = false; $("password").required = false;
      $("login-submit").textContent = "Connect securely";
      $("connection-help").textContent = "Posts marked Draft are excluded from the website. Draft source text is stored in your repository and is readable if that repository is public.";
    }
    $("login-form").hidden = false;
  }

  $("login-form").addEventListener("submit", async event => {
    event.preventDefault(); $("login-submit").disabled = true; $("login-error").textContent = "";
    try {
      if (state.mode === "local") {
        const result = await localRequest(state.session.setup_required ? "setup" : "login", { username: $("username").value.trim(), password: $("password").value, setup_token: state.session.setup_token });
        state.csrf = result.csrf; state.username = result.username; $("password").value = "";
      } else {
        state.repository = $("repository").value.trim(); state.branch = $("branch").value.trim();
        if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(state.repository) || !state.branch) throw new Error("Enter a repository as owner/name and a branch.");
        state.token = $("github-token").value.trim(); $("github-token").value = "";
        const identity = await github("/user"); state.username = identity.login;
        await github(repositoryPath());
      }
      await loadContent();
    } catch (error) { state.token = ""; $("login-error").textContent = error.message; }
    finally { $("login-submit").disabled = false; }
  });
  $("save").addEventListener("click", save);
  $("logout").addEventListener("click", signOut);
  $("reload").addEventListener("click", async () => {
    if (state.dirty && !confirm("Discard unsaved edits and reload the saved content?")) return;
    try { await loadContent(); notice("Saved content reloaded."); } catch (error) { notice(error.message, true); }
  });
  $("export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.content, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = element("a", { href: url, download: "portfolio-content-backup.json" });
    anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $("import-file").addEventListener("change", async event => {
    const file = event.target.files[0];
    try {
      if (!file || file.size > 2_000_000) throw new Error("Choose a content backup smaller than 2 MB.");
      const content = JSON.parse(await file.text());
      validateShape(content, state.schema);
      if (!confirm("Replace the editor content with this backup? Save changes to apply it to the website.")) return;
      state.content = content; markDirty(); renderNavigation(); renderEditor(); notice("Backup imported into the editor. Review it, then save.");
    } catch (error) { notice(error.message, true); }
    finally { event.target.value = ""; }
  });
  $("close-preview").addEventListener("click", () => $("preview-dialog").close());
  $("change-password").addEventListener("click", () => { $("password-error").textContent = ""; $("password-dialog").showModal(); });
  $("cancel-password").addEventListener("click", () => $("password-dialog").close());
  $("password-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (state.dirty && !confirm("Changing the password signs you out and discards unsaved edits. Continue?")) return;
    try {
      await localRequest("password", { current_password: $("current-password").value, new_password: $("new-password").value });
      $("password-form").reset(); $("password-dialog").close(); state.dirty = false;
      state.content = null; state.csrf = ""; $("studio").hidden = true; $("login-screen").hidden = false;
      await initialiseLogin(); $("login-description").textContent = "Password updated. Log in with your new password.";
    } catch (error) { $("password-error").textContent = error.message; }
  });
  addEventListener("beforeunload", event => { if (state.dirty) { event.preventDefault(); event.returnValue = ""; } });
  addEventListener("keydown", event => { if ((event.ctrlKey || event.metaKey) && event.key === "s" && state.content) { event.preventDefault(); save(); } });
  Promise.all([fetch("schema.json", { cache: "no-store" }).then(r => r.json()), fetch("config.json", { cache: "no-store" }).then(r => r.json())])
    .then(async ([schema, config]) => { state.schema = schema; state.config = config; await initialiseLogin(); })
    .catch(() => { $("login-description").textContent = "The admin files could not be loaded. Refresh the page or check that the full admin folder is present."; });
})();
