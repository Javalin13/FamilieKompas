import { boundaryItems, shortBoundary } from "@/content/nl/boundaries";

export function BoundaryNotice() {
  return (
    <section className="rounded-lg border border-kompas-line bg-kompas-paper p-5 shadow-soft">
      <p className="text-sm font-medium text-kompas-green">{shortBoundary}</p>
      <ul className="mt-3 space-y-2 text-sm text-kompas-muted">
        {boundaryItems.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}
