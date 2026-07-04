import type { Publication } from "../../types/publication";
import { PublicationCard } from "./PublicationCard";

export function PublicationList({ publications }: { publications: Publication[] }) {
  return (
    <div className="grid grid--cards">
      {publications.map((publication) => (
        <PublicationCard key={publication.title} publication={publication} />
      ))}
    </div>
  );
}

