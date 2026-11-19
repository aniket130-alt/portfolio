/** Row of small tech-stack chips (project cards, experience entries). */
export function TagList({ tags, label, className = "" }: { tags: string[]; label: string; className?: string }) {
  if (!tags.length) return null;
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label={label}>
      {tags.map((tag) => (
        <li key={tag} className="chip">
          {tag}
        </li>
      ))}
    </ul>
  );
}
