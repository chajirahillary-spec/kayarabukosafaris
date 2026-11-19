"use client";

import { useState } from "react";
import Link from "next/link";
import { stories as initialStories, storyCategories } from "@/data/content";
import type { Story } from "@/lib/types";
import { X } from "lucide-react";

interface AdminStory extends Story {
  status: "published" | "draft";
  views: number;
}

export default function AdminStoriesPage() {
  const [storiesList, setStoriesList] = useState<AdminStory[]>(() =>
    initialStories.map((s, idx) => ({
      ...s,
      status: "published" as const,
      views: 450 + idx * 128,
    }))
  );

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newArticle, setNewArticle] = useState({
    title: "",
    slug: "",
    categorySlug: "culture-and-heritage",
    author: "KayArabuko Editorial",
    excerpt: "",
    bodyText: "",
    readMinutes: 4,
  });

  const filtered = storiesList.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      s.author.toLowerCase().includes(search.toLowerCase());

    const matchesCat = catFilter === "ALL" || s.categorySlug === catFilter;
    return matchesSearch && matchesCat;
  });

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setNewArticle({ ...newArticle, title, slug });
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.slug) return;

    const created: AdminStory = {
      slug: newArticle.slug,
      title: newArticle.title,
      categorySlug: newArticle.categorySlug,
      author: newArticle.author,
      excerpt: newArticle.excerpt,
      publishedAt: new Date().toISOString().split("T")[0],
      readMinutes: Number(newArticle.readMinutes) || 5,
      image: { alt: newArticle.title },
      body: newArticle.bodyText
        ? newArticle.bodyText.split("\n\n").filter(Boolean)
        : ["Kenya's landscapes offer endless storytelling opportunities."],
      relatedDestinationSlugs: [],
      status: "published",
      views: 1,
    };

    setStoriesList([created, ...storiesList]);
    setIsModalOpen(false);
    setNewArticle({
      title: "",
      slug: "",
      categorySlug: "culture-and-heritage",
      author: "KayArabuko Editorial",
      excerpt: "",
      bodyText: "",
      readMinutes: 4,
    });
  };

  const toggleStatus = (slug: string) => {
    setStoriesList(
      storiesList.map((s) =>
        s.slug === slug
          ? { ...s, status: s.status === "published" ? "draft" : "published" }
          : s
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-forest">Safari Stories & Journal CMS</h1>
          <p className="text-xs text-charcoal/70">
            Publish authentic field articles, conservation updates, cultural essays, and safari travel guides.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-ka bg-forest px-4 py-2 text-xs font-semibold text-ivory hover:bg-green transition-colors"
        >
          <span>+ Write New Story</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Published Articles</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">
            {storiesList.filter((s) => s.status === "published").length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Live on /stories</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Drafts</p>
          <p className="mt-1 font-serif text-2xl font-bold text-gold">
            {storiesList.filter((s) => s.status === "draft").length}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Under editorial review</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Categories</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{storyCategories.length}</p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Organized topic tags</p>
        </div>
        <div className="rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">Total Readers</p>
          <p className="mt-1 font-serif text-2xl font-bold text-forest">
            {storiesList.reduce((sum, s) => sum + s.views, 0).toLocaleString()}
          </p>
          <p className="mt-0.5 text-[10px] text-charcoal/60">Organic SEO reader engagement</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-ka border border-charcoal/10 bg-ivory p-4 shadow-xs">
        <input
          type="text"
          placeholder="Search articles by title, author, or excerpt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md w-full rounded-ka border border-charcoal/20 bg-cream/20 px-3 py-2 text-xs focus:border-forest focus:outline-none"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-ka border border-charcoal/20 bg-cream/20 px-3 py-2 text-xs focus:border-forest focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {storyCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stories Table */}
      <div className="overflow-hidden rounded-ka border border-charcoal/10 bg-ivory shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-charcoal/10 bg-cream/30 text-[11px] font-semibold uppercase tracking-wider text-charcoal/70">
            <tr>
              <th className="p-3.5">Article Title & Excerpt</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Author</th>
              <th className="p-3.5">Read Time</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Published</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {filtered.map((item) => (
              <tr key={item.slug} className="hover:bg-cream/15 transition-colors">
                <td className="p-3.5 max-w-sm">
                  <p className="font-semibold text-forest text-sm">{item.title}</p>
                  <p className="text-[11px] text-charcoal/70 truncate">{item.excerpt}</p>
                </td>
                <td className="p-3.5">
                  <span className="rounded bg-cream px-2 py-0.5 text-[10px] font-medium text-charcoal/80">
                    {storyCategories.find((c) => c.slug === item.categorySlug)?.name || item.categorySlug}
                  </span>
                </td>
                <td className="p-3.5 text-charcoal">{item.author}</td>
                <td className="p-3.5 text-charcoal/70">{item.readMinutes} min read</td>
                <td className="p-3.5">
                  <span
                    className={`rounded-ka px-2 py-0.5 text-[10px] font-semibold ${
                      item.status === "published"
                        ? "bg-green/15 text-forest border border-green/30"
                        : "bg-charcoal/10 text-charcoal/70"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3.5 text-charcoal/70">{item.publishedAt}</td>
                <td className="p-3.5 text-right space-x-2">
                  <button
                    onClick={() => toggleStatus(item.slug)}
                    className="rounded border border-charcoal/20 px-2 py-1 text-[11px] text-charcoal hover:bg-cream/40"
                  >
                    {item.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    href={`/stories/${item.slug}`}
                    target="_blank"
                    className="inline-block rounded border border-charcoal/20 px-2 py-1 text-[11px] font-medium text-charcoal hover:bg-cream/40"
                  >
                    View ↗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Write Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-ka border border-charcoal/15 bg-ivory p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-forest">Compose Safari Journal Article</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-charcoal/60 hover:text-charcoal"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal">Story Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. In Search of the Mountain Bongo: High-Altitude Tracking in the Aberdares"
                  value={newArticle.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={newArticle.slug}
                    onChange={(e) => setNewArticle({ ...newArticle, slug: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 font-mono text-[11px] focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Editorial Category</label>
                  <select
                    value={newArticle.categorySlug}
                    onChange={(e) => setNewArticle({ ...newArticle, categorySlug: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  >
                    {storyCategories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal">Author / Contributor</label>
                  <input
                    type="text"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal">Estimated Read Time (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={newArticle.readMinutes}
                    onChange={(e) => setNewArticle({ ...newArticle, readMinutes: Number(e.target.value) })}
                    className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal">Summary Excerpt</label>
                <textarea
                  rows={2}
                  placeholder="A compelling one or two sentence summary shown on listings and Google search snippet..."
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal">Article Body (Paragraphs separated by double line break)</label>
                <textarea
                  rows={6}
                  placeholder="Write the full story or copy-paste draft content..."
                  value={newArticle.bodyText}
                  onChange={(e) => setNewArticle({ ...newArticle, bodyText: e.target.value })}
                  className="mt-1 w-full rounded-ka border border-charcoal/20 bg-cream/20 p-2 leading-relaxed focus:border-forest focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-charcoal/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-ka px-4 py-2 font-medium text-charcoal hover:bg-cream/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-ka bg-forest px-4 py-2 font-semibold text-ivory hover:bg-green"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
