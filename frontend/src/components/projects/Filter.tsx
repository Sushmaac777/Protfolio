type FilterProps = {
  query: string;
  activeTag: string;
  tags: string[];
  onQueryChange: (value: string) => void;
  onTagChange: (value: string) => void;
};

export function Filter({ query, activeTag, tags, onQueryChange, onTagChange }: FilterProps) {
  return (
    <div className="filter-bar">
      <input
        aria-label="Search projects"
        className="input"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by project or stack"
        value={query}
      />
      <select
        aria-label="Filter projects by technology"
        className="input"
        onChange={(event) => onTagChange(event.target.value)}
        value={activeTag}
      >
        <option value="">All technologies</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}

