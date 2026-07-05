type FilterProps = {
  query: string;
  activeTag: string;
  tags: string[];
  onQueryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  selectLabel?: string;
  allOptionLabel?: string;
};

export function Filter({
  query,
  activeTag,
  tags,
  onQueryChange,
  onTagChange,
  searchLabel = "Search projects",
  searchPlaceholder = "Search by project or stack",
  selectLabel = "Filter projects by technology",
  allOptionLabel = "All technologies",
}: FilterProps) {
  return (
    <div className="filter-bar">
      <input
        aria-label={searchLabel}
        className="input"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={searchPlaceholder}
        value={query}
      />
      <select
        aria-label={selectLabel}
        className="input"
        onChange={(event) => onTagChange(event.target.value)}
        value={activeTag}
      >
        <option value="">{allOptionLabel}</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}
