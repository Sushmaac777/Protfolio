"""Render the editable portfolio into plain HTML and CSS for GitHub Pages."""
from __future__ import annotations

import argparse
from copy import deepcopy
from datetime import date
from html import escape
import json
import hashlib
import os
from pathlib import Path
import re
import shutil
import tempfile
from urllib.parse import quote, urlsplit

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = json.loads((ROOT / "admin/schema.json").read_text())
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
MAX_CONTENT_BYTES = 2_000_000
e = lambda value: escape(str(value), quote=True)


class ContentError(ValueError):
    pass


def validate_content(value, schema=SCHEMA, path="Content", depth=0):
    """Validate the complete document, including URLs and unique public routes."""
    if depth > 18:
        raise ContentError("Content is nested too deeply.")
    kind = schema["type"]
    if kind == "object":
        if not isinstance(value, dict) or set(value) != set(schema["fields"]):
            raise ContentError(f"{path}: fields do not match the editor schema.")
        for key, child in schema["fields"].items():
            validate_content(value[key], child, f"{path} / {child['label']}", depth + 1)
    elif kind == "array":
        limit = schema.get("maxItems", 200)
        if not isinstance(value, list) or len(value) > limit:
            raise ContentError(f"{path}: use at most {limit} items.")
        for index, child in enumerate(value):
            validate_content(child, schema["item"], f"{path} / item {index + 1}", depth + 1)
    elif kind == "boolean":
        if not isinstance(value, bool):
            raise ContentError(f"{path}: expected a checkbox value.")
    elif kind == "number":
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not 0 <= value <= 100:
            raise ContentError(f"{path}: use a number between 0 and 100.")
    else:
        if not isinstance(value, str) or len(value) > 100_000 or "\x00" in value:
            raise ContentError(f"{path}: invalid or excessively long text.")
        if schema.get("required") and not value.strip():
            raise ContentError(f"{path}: this field is required.")
        if kind == "select" and value not in schema["options"]:
            raise ContentError(f"{path}: choose one of the available options.")
        if kind == "date" and value:
            try:
                date.fromisoformat(value)
            except ValueError:
                raise ContentError(f"{path}: use a valid date.")
        if kind == "image" and value and not safe_url(value, image=True):
            raise ContentError(f"{path}: use an assets/ path or HTTPS image URL.")
    if depth == 0:
        if len(json.dumps(value).encode()) > MAX_CONTENT_BYTES:
            raise ContentError("The content file is too large.")
        for collection in ["projects", "blogs", "customPages"]:
            seen = set()
            for item in value[collection]:
                name = item["slug"]
                if not SLUG.fullmatch(name) or len(name) > 100:
                    raise ContentError(f"{collection}: URL names must use lowercase letters, numbers, and hyphens.")
                if name in seen:
                    raise ContentError(f"{collection}: duplicate URL name '{name}'.")
                seen.add(name)
        email = value["profile"]["email"]
        if not re.fullmatch(r"[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+", email):
            raise ContentError("Profile: enter a valid contact email address.")


def safe_url(url, image=False):
    if not isinstance(url, str) or not url or re.search(r"[\x00-\x20\\]", url):
        return False
    parts = urlsplit(url)
    if parts.scheme:
        return parts.scheme == "https" and bool(parts.netloc) if image else (
            parts.scheme in ("https", "http") and bool(parts.netloc)
            or parts.scheme == "mailto" and bool(parts.path)
        )
    if url.startswith(("/", "//")) or ".." in parts.path.split("/"):
        return False
    return parts.path.startswith("assets/") if image else True


def soup(text):
    return BeautifulSoup(text, "html.parser")


def fill(element, html):
    element.clear()
    for child in list(soup(html).contents):
        element.append(child)


def set_text(element, value):
    element.clear()
    element.append(str(value))


def badges(items):
    return '<div class="badge-row">' + "".join(f'<span class="badge">{e(x)}</span>' for x in items) + "</div>"


def paragraphs(value):
    return "".join(f"<p>{e(part).replace(chr(10), '<br/>')}</p>" for part in re.split(r"\n\s*\n", value.strip()) if part)


def heading(copy):
    return f'<div class="section-heading"><p class="eyebrow">{e(copy["eyebrow"])}</p><h1>{e(copy["title"])}</h1><p>{e(copy["description"])}</p></div>'


def relative(route):
    return "../" * len(route.split("/")) if route else "./"


def asset(url, base):
    if not safe_url(url, image=True):
        return ""
    return url if urlsplit(url).scheme else base + url


def link(url, base, fallback):
    if not safe_url(url):
        return fallback
    return url if urlsplit(url).scheme or url.startswith("#") else base + url


def render_site(data):
    validate_content(data)
    templates = {name: soup((ROOT / f"cms/templates/{name}.html").read_text()) for name in ["layout", "home", "about", "achievements"]}
    settings, profile, home, about = [data[k] for k in ["settings", "profile", "home", "about"]]
    mail = "mailto:" + quote(profile["email"], safe="@.+-_")
    projects = [p for p in data["projects"] if p["published"]]
    blogs = sorted([b for b in data["blogs"] if b["status"] == "published"], key=lambda b: b["published_at"], reverse=True)
    custom = [p for p in data["customPages"] if p["status"] == "published"]
    outputs = {}
    filters = []
    nav = [("About", "about"), ("Experience", "experience"), ("Projects", "projects"), ("Blog", "blog"), ("Achievements", "achievements")]
    extras = [("Research", "research"), ("Skills", "skills"), ("Journey", "journey"), ("Résumé", "resume"), ("Contact", "contact")]
    extras += [(p["title"], "pages/" + p["slug"]) for p in custom if p["show_in_navigation"]]

    def navigation(items, base, active):
        return "".join(f'<a class="nav__link{" nav__link--active" if route == active else ""}" href="{base}{route + "/" if route else ""}index.html"{" aria-current=page" if route == active else ""}>{e(label)}</a>' for label, route in items)

    def page(route, title, description, body=None, document=None, active=None):
        dom = deepcopy(document if document is not None else templates["layout"])
        base = relative(route)
        active = active if active is not None else route.split("/")[0]
        if body is not None:
            fill(dom.main, body)
        set_text(dom.title, title + " | " + settings["brand_name"])
        dom.select_one('meta[name="description"]')["content"] = description
        dom.select_one('link[rel="stylesheet"]')["href"] = base + "assets/css/style.css"
        dom.select_one('link[rel="icon"]')["href"] = base + "assets/favicon.svg"
        extra_css = dom.new_tag("link", rel="stylesheet", href=base + "assets/css/filters.css")
        dom.head.append(extra_css)
        set_text(dom.select_one(".brand__name"), settings["brand_name"])
        set_text(dom.select_one(".brand__meta"), settings["brand_meta"])
        dom.select_one(".brand")["href"] = base + "index.html"
        dom.select_one(".brand")["aria-label"] = settings["brand_name"] + " — home"
        set_text(dom.select_one(".brand__avatar"), "".join(p[0] for p in settings["brand_name"].split()[:2]).upper())
        fill(dom.select_one("nav.nav"), navigation(nav, base, active))
        fill(dom.select_one(".mobile-nav"), navigation([("Home", "")] + nav + extras, base, active))
        dom.select_one(".nav-cta")["href"] = base + "contact/index.html"
        footer = dom.select_one(".static-footer")
        set_text(footer.select_one(".brand__name"), settings["footer_title"])
        footer.select_one(".brand__name")["href"] = base + "index.html"
        set_text(footer.select_one("div p"), settings["footer_description"])
        fill(footer.select_one("nav"), navigation(extras, base, active) + f'<a href="{base}admin/index.html">Admin</a>')
        set_text(footer.select_one(".footer-copyright"), f'© {settings["copyright_year"]} {settings["footer_title"]}. {settings["copyright"]}')
        outputs[(route + "/" if route else "") + "index.html"] = dom.prettify()

    def filtered(name, items, tags, renderer, all_label):
        choices = list(dict.fromkeys(t for item in items for t in tags(item)))
        group = name.lower().replace(" ", "-")
        html = f'<fieldset class="filter-set"><legend class="visually-hidden">{e(name)}</legend><input type="radio" class="filter-radio" name="{group}" id="{group}-all" checked/><label class="filter-chip" for="{group}-all">{e(all_label)}</label>'
        for i, tag in enumerate(choices):
            html += f'<input type="radio" class="filter-radio" name="{group}" id="{group}-{i}"/><label class="filter-chip" for="{group}-{i}">{e(tag)}</label>'
            filters.append(f'#{group}-{i}:checked ~ .filter-results > .filter-item:not([data-topics~="t{i}"]) {{ display:none; }}')
        html += '<div class="filter-results grid grid--cards">'
        for item in items:
            tokens = " ".join(f"t{choices.index(t)}" for t in tags(item))
            html += f'<div class="filter-item" data-topics="{tokens}">{renderer(item)}</div>'
        return html + '</div></fieldset>' + ('<p class="muted">Nothing published here yet.</p>' if not items else "")

    def project_card(p, base):
        return f'<article class="card project-card"><div class="project-card__meta"><span class="badge">{e(p["year"])}</span><span>{e(p["status"])}</span></div><h3>{e(p["title"])}</h3><p>{e(p["summary"])}</p><p class="muted">{e(" · ".join(p["stack"]))}</p><a class="text-link" href="{base}projects/{p["slug"]}/index.html">View details →</a></article>'

    # Home reuses the existing visual design and local images.
    dom = deepcopy(templates["home"])
    fill(dom.select_one(".landing-hero__title"), "".join(f'<span class="landing-hero__title-line">{e(line["text"])}<span class="landing-hero__title-accent">{e(line["accent"])}</span>{e(line["suffix"])}</span>' for line in home["headline"]))
    set_text(dom.select_one(".landing-hero__summary"), profile["summary"])
    set_text(dom.select_one(".landing-hero__primary span"), home["primary_action"])
    set_text(dom.select_one(".landing-hero__secondary"), home["secondary_action"])
    photo = dom.select_one(".landing-hero__portrait-image")
    photo["src"] = asset(profile["photo"], "./")
    photo["alt"] = profile["name"] + " portrait"
    fill(dom.select_one(".landing-hero__visual-pill"), '<span class="landing-hero__pill-dot" aria-hidden="true"></span>' + e(home["availability"]))
    prototypes = [deepcopy(card) for card in dom.select(".landing-hero__orbit-item")]
    orbit = dom.select_one(".landing-hero__orbit")
    orbit.clear()
    for index, c in enumerate(home["callouts"][:5]):
        card = deepcopy(prototypes[index % len(prototypes)])
        set_text(card.select_one("strong"), c["title"])
        set_text(card.select_one("small"), c["subtitle"])
        orbit.append(card)
    fill(dom.select_one(".landing-stats"), "".join(f'<a class="landing-stat" href="{e(link(s["link"], "./", mail))}"><div class="landing-stat__copy"><p class="landing-stat__label">{e(s["label"])}</p><p class="landing-stat__value">{e(s["value"])}</p><p class="landing-stat__note">{e(s["note"])}</p></div><span aria-hidden="true">↗</span></a>' for s in home["highlights"]))
    set_text(dom.select_one(".what-i-do__heading h2"), home["services_title"])
    set_text(dom.select_one(".what-i-do__heading p"), home["services_description"])
    prototypes = [deepcopy(card) for card in dom.select(".what-i-do__card")]
    container = dom.select_one(".what-i-do__grid")
    container.clear()
    for index, item in enumerate(home["services"]):
        card = deepcopy(prototypes[index % len(prototypes)])
        set_text(card.h3, item["title"])
        set_text(card.p, item["description"])
        container.append(card)
    featured = dom.select_one(".grid--three").parent
    set_text(featured.h2, home["featured_title"])
    set_text(featured.select_one(".section-heading > p:last-child"), home["featured_description"])
    fill(featured.select_one(".grid--three"), "".join(project_card(p, "./") for p in projects if p["featured"]))
    cta = dom.select_one(".cta-panel")
    set_text(cta.h2, home["cta_title"])
    set_text(cta.select_one("h2 + p"), home["cta_description"])
    set_text(cta.select_one("a"), home["cta_button"])
    page("", settings["brand_name"] + " Portfolio", profile["summary"], document=dom, active="")

    # About: repeatable cards remain independently editable.
    dom = deepcopy(templates["about"])
    for selector, key in [(".about-hero-panel__pill > span:last-child", "heroEyebrow"), (".about-hero-panel__title > span:first-child", "heroTitleLead"), (".about-hero-panel__accent", "heroTitleAccent"), (".about-journey-panel h2", "educationTitle"), (".about-journey-panel .about-page-heading p", "educationDescription")]:
        set_text(dom.select_one(selector), about[key])
    fill(dom.select_one(".about-hero-panel__text"), "".join(f"<p>{e(p)}</p>" for p in about["heroParagraphs"]))
    for i, stage in enumerate(dom.select(".about-hero-panel__stage")):
        if i >= len(about["heroPathway"]):
            stage.decompose()
        else:
            item = about["heroPathway"][i]
            set_text(stage.select_one("strong"), item["title"])
            set_text(stage.select_one(".about-hero-panel__stage-copy span"), item["subtitle"])
    tones = {"blue": "#3c79ff", "green": "#41b883", "violet": "#8a63ff", "amber": "#ff9a3d", "cyan": "#26b6d9"}
    def repeat(selector, container_selector, items, updater):
        prototypes = [deepcopy(card) for card in dom.select(selector)]
        container = dom.select_one(container_selector)
        container.clear()
        for index, item in enumerate(items):
            card = deepcopy(prototypes[index % len(prototypes)])
            card["style"] = "--about-tone:" + tones.get(item.get("tone", "blue"), tones["blue"])
            updater(card, item)
            container.append(card)
    def education_card(card, item):
        for selector, key in [(".about-journey-card__year", "year"), ("h3", "outcome"), (".about-journey-card__stage", "stage"), (".about-journey-card__institution", "institution"), (".about-journey-card__detail", "detail")]:
            set_text(card.select_one(selector), item[key])
        fill(card.select_one(".about-journey-card__badges"), "".join(f'<span class="about-journey-card__badge">{e(x)}</span>' for x in item["highlights"]))
    repeat(".about-journey-card", ".about-journey-panel__grid", about["educationJourney"], education_card)
    set_text(dom.select(".about-subsection")[0].h2, about["lessonTitle"])
    def lesson_card(card, item):
        for selector, key in [("h3", "title"), (".about-lesson-card__copy p", "eyebrow"), (".about-lesson-card__copy span", "description")]:
            set_text(card.select_one(selector), item[key])
    repeat(".about-lesson-card", ".about-lessons-grid", about["lessonItems"], lesson_card)
    def skills_card(card, item):
        set_text(card.h3, item["title"])
        set_text(card.p, item["description"])
        fill(card.select_one(".about-capabilities-card__chips"), "".join(f'<span class="about-capabilities-card__chip">{e(x)}</span>' for x in item["items"]))
    repeat(".about-capabilities-card", ".about-capabilities-grid", about["skillGroups"], skills_card)
    set_text(dom.select(".about-subsection")[-1].h2, about["nextTitle"])
    def next_card(card, item):
        set_text(card.h3, item["title"])
        set_text(card.p, item["description"])
    repeat(".about-next-card", ".about-next-grid", about["nextSteps"], next_card)
    fill(dom.select_one(".about-quote-banner__copy p"), f'<span>{e(about["quoteLead"])}</span><strong>{e(about["quoteAccent"])}</strong>')
    page("about", "About", about["heroTitleLead"] + " " + about["heroTitleAccent"], document=dom)

    page("projects", "Projects", data["pageHeadings"]["projects"]["title"], '<section class="section">' + heading(data["pageHeadings"]["projects"]) + filtered("Project technologies", projects, lambda p: p["stack"], lambda p: project_card(p, "../"), "All projects") + "</section>")
    for p in projects:
        links = "".join(f'<a class="text-link" href="{e(link(item["url"], "../../", mail))}">{e(item["label"])}</a> ' for item in p["links"])
        if not links:
            links = f'<a class="text-link" href="{mail}?subject={quote(p["title"])}">Ask about this project →</a>'
        body = f'<div class="page"><a class="text-link" href="../index.html">← All projects</a><section class="section"><div class="project-detail"><div class="project-detail__header"><span class="badge">{e(p["year"])}</span><h1>{e(p["title"])}</h1><p>{e(p["summary"])}</p></div><div class="project-detail__body"><article class="card"><h2>Overview</h2>{paragraphs(p["description"])}</article><article class="card"><h2>Stack</h2>{badges(p["stack"])}</article><article class="card"><h2>Links</h2><div class="button-row">{links}</div></article></div></div></section></div>'
        page("projects/" + p["slug"], p["title"], p["summary"], body, active="projects")
    def reading_time(b):
        return f'{max(1, (len(b["content"].split()) + 199) // 200)} min read'
    def blog_card(b):
        return f'<article class="card"><div class="project-card__meta"><span class="badge">{e(b["published_at"])}</span><span>{reading_time(b)}</span></div><h3>{e(b["title"])}</h3><p>{e(b["excerpt"])}</p>{badges(b["tags"])}<a class="text-link" href="{b["slug"]}/index.html">Read article →</a></article>'
    page("blog", "Blog", data["pageHeadings"]["blog"]["title"], '<section class="section">' + heading(data["pageHeadings"]["blog"]) + filtered("Blog topics", blogs, lambda b: b["tags"], blog_card, "All topics") + "</section>")
    for b in blogs:
        image = f'<img class="blog-cover" src="{e(asset(b["cover_image"], "../../"))}" alt="{e(b["title"])}"/>' if b["cover_image"] else ""
        body = f'<div class="page"><a class="text-link" href="../index.html">← All writing</a><section class="section"><article class="prose-card prose-card--wide"><div class="project-card__meta"><time datetime="{e(b["published_at"])}">{e(b["published_at"])}</time><span>{reading_time(b)}</span></div><h1>{e(b["title"])}</h1>{image}<p class="article-lead">{e(b["excerpt"])}</p>{paragraphs(b["content"])}{badges(b["tags"])}<div class="article-footer"><a class="text-link" href="{mail}?subject={quote(b["title"])}">Continue the conversation →</a></div></article></section></div>'
        page("blog/" + b["slug"], b["title"], b["excerpt"], body, active="blog")
    cards = ""
    for p in data["publications"]:
        url = link(p["link"], "../", mail + "?subject=" + quote(p["title"]))
        cards += f'<article class="card"><div class="project-card__meta"><span class="badge">{e(p["year"])}</span><span>{e(p["venue"])}</span></div><h2>{e(p["title"])}</h2><p>{e(p["abstract"])}</p>{badges(p["tags"])}<a class="text-link" href="{e(url)}">{"Read publication" if p["link"] else "Ask about this research"} →</a></article>'
    for route in ["research", "publications"]:
        page(route, "Research", data["pageHeadings"]["publications"]["title"], '<section class="section">' + heading(data["pageHeadings"]["publications"]) + '<div class="grid grid--cards">' + cards + "</div></section>")
    experience = ""
    for x in data["experience"]:
        experience += f'<article class="card"><span class="badge">{e(x["period"])}</span><h2>{e(x["role"])} · {e(x["company"])}</h2><p>{e(x["summary"])}</p><ul class="bullet-list">{"".join(f"<li>{e(h)}</li>" for h in x["highlights"])}</ul>{badges(x["technologies"])}</article>'
    page("experience", "Experience", data["pageHeadings"]["experience"]["title"], '<section class="section">' + heading(data["pageHeadings"]["experience"]) + '<div class="experience-list">' + experience + "</div></section>")
    skill_cards = ""
    for ci, category in enumerate(data["skills"]):
        meters = ""
        for si, skill in enumerate(category["items"]):
            sid = f"skill-{ci}-{si}"
            meters += f'<div class="static-skill"><label for="{sid}">{e(skill["name"])}<span>{skill["level"]}%</span></label><meter id="{sid}" min="0" max="100" value="{skill["level"]}">{skill["level"]}%</meter></div>'
        skill_cards += f'<article class="card"><h2>{e(category["name"])}</h2><p>{e(category["description"])}</p><div class="skill-stack">{meters}</div></article>'
    page("skills", "Skills", data["pageHeadings"]["skills"]["title"], '<section class="section">' + heading(data["pageHeadings"]["skills"]) + '<p class="muted">Levels are personal self-assessments, not certifications.</p><div class="grid grid--cards">' + skill_cards + "</div></section>")
    timeline = ""
    for i, x in enumerate(reversed(data["journey"])):
        timeline += f'<article class="journey-step"><div class="journey-step__year"><span>{e(x["year"])}</span></div><div class="journey-step__dot" aria-hidden="true"><span></span></div><div class="journey-step__content"><p class="journey-step__count">{i+1:02}</p><h2>{e(x["title"])}</h2><p>{e(x["detail"])}</p></div></article>'
    page("journey", "Journey", data["pageHeadings"]["journey"]["title"], '<section class="section">' + heading(data["pageHeadings"]["journey"]) + '<div class="journey-timeline">' + timeline + "</div></section>")
    ach = data["achievements"]
    stats = "".join(f'<article class="achievements-stat"><strong class="achievements-stat__value">{e(s["value"])}</strong><span class="achievements-stat__label">{e(s["label"])}</span></article>' for s in ach["stats"])
    def achievement_card(x):
        tone = x["tone"] if x["tone"] in ["blue", "green", "violet", "amber", "rose", "cyan"] else "blue"
        return f'<article class="achievement-card achievement-card--{tone}"><div class="achievement-card__content"><span class="achievement-card__year">{e(x["year"])}</span><h2>{e(x["title"])}</h2><p>{e(x["description"])}</p><span class="achievement-card__tag">{e(x["tag"])}</span></div></article>'
    body = f'<section class="section achievements-section"><div class="achievements-layout"><div class="achievements-hero"><div class="achievements-intro"><h1>{e(ach["title"])}</h1><p>{e(ach["description"])}</p></div><div class="achievements-stats">{stats}</div></div>' + filtered("Achievement categories", ach["entries"], lambda a: a["filters"], achievement_card, "All achievements") + f'<blockquote class="achievements-quote"><span class="achievements-quote__mark" aria-hidden="true">“</span><p>{e(ach["quote"])}</p></blockquote></div></section>'
    page("achievements", "Achievements", ach["description"], body)
    social = "".join(f'<a class="text-link" href="{e(link(s["url"], "../", mail))}" rel="noopener noreferrer">{e(s["label"])} ↗</a> ' for s in profile["social_links"])
    body = '<section class="section contact-layout"><div>' + heading(data["pageHeadings"]["contact"]) + f'<p>{e(profile["availability"])}</p><p>Based in {e(profile["location"])}</p></div><div class="card contact-card"><h2>Say hello.</h2><a class="contact-email text-link" href="{mail}">{e(profile["email"])}</a><a class="landing-hero__primary" href="{mail}?subject=Let%27s%20connect">Open your email app ↗</a><p class="muted">The button opens your email app. You can also copy the address into your preferred email service.</p><div class="button-row">{social}</div></div></section>'
    page("contact", "Contact", data["pageHeadings"]["contact"]["title"], body)
    resume = f'<section class="section resume"><div class="section-heading"><p class="eyebrow">Résumé</p><h1>{e(settings["brand_name"])}</h1><p>{e(profile["title"])}</p></div><p>{e(profile["location"])} · <a class="text-link" href="{mail}">{e(profile["email"])}</a></p><p class="print-help">To save a PDF, use your browser’s Print menu and choose “Save as PDF”.</p><h2>Profile</h2><p>{e(profile["summary"])}</p><h2>Experience</h2>{experience}<h2>Education</h2>'
    for item in about["educationJourney"]:
        resume += f'<article><h3>{e(item["stage"])}</h3><p>{e(item["institution"])} · {e(item["year"])}</p><p>{e(item["detail"])}</p></article>'
    resume += "<h2>Skills</h2>"
    for item in data["skills"]:
        resume += f'<p><strong>{e(item["name"])}:</strong> {e(", ".join(s["name"] for s in item["items"]))}</p>'
    resume += '<h2>Selected Projects</h2><div class="grid grid--cards">' + "".join(project_card(p, "../") for p in projects if p["featured"]) + "</div><h2>Research</h2>"
    for item in data["publications"]:
        resume += f'<p><strong>{e(item["title"])}</strong> · {e(item["venue"])}, {e(item["year"])}</p>'
    page("resume", "Résumé", profile["summary"], resume + "</section>")
    for item in custom:
        page("pages/" + item["slug"], item["title"], item["description"], f'<section class="section"><article class="prose-card prose-card--wide"><h1>{e(item["title"])}</h1><p class="article-lead">{e(item["description"])}</p>{paragraphs(item["content"])}</article></section>', active="pages/" + item["slug"])
    outputs["assets/css/filters.css"] = "/* Generated content filters. Edit content through /admin/. */\n" + "\n".join(filters) + "\n.blog-cover{display:block;width:100%;max-height:32rem;object-fit:cover;border-radius:16px;margin:1.5rem 0}\n"
    outputs[".nojekyll"] = ""
    outputs["404.html"] = (ROOT / "404.html").read_text()
    return outputs


def atomic_write(path, value, mode=None):
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, name = tempfile.mkstemp(prefix=".writing-", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as output:
            output.write(value)
        if mode is not None:
            os.chmod(name, mode)
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)


def write_site(outputs, destination=ROOT, package=False):
    destination = Path(destination).resolve()
    manifest = destination / ".local-admin/generated.json"
    if package:
        identifier = hashlib.sha256(str(destination).encode()).hexdigest()[:20]
        manifest = ROOT / f".local-admin/package-{identifier}.json"
    old = json.loads(manifest.read_text()) if manifest.exists() else []
    for name, value in outputs.items():
        atomic_write(destination / name, value)
    for name in set(old) - set(outputs):
        path = (destination / name).resolve()
        if path.is_relative_to(destination) and path.suffix == ".html" and path.is_file():
            path.unlink()
    atomic_write(manifest, json.dumps(sorted(outputs)))
    if package:
        for name in ["assets", "admin"]:
            shutil.copytree(ROOT / name, destination / name, dirs_exist_ok=True)
        # Copying shared assets must not overwrite newly generated filters.
        atomic_write(destination / "assets/css/filters.css", outputs["assets/css/filters.css"])
    return len(outputs)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT)
    args = parser.parse_args()
    content = json.loads((ROOT / "cms/site.json").read_text())
    count = write_site(render_site(content), args.output, package=args.output.resolve() != ROOT)
    print(f"Built {count} static files in {args.output}. Draft posts and private admin files are excluded.")
