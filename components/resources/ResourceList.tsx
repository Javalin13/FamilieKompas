import { verifiedResources } from "@/content/nl/resources";

type ResourceItem = {
  title: string;
  description: string;
  url?: string;
  crisis?: boolean;
};

export function ResourceList({
  crisisOnly = false,
  supportOnly = false,
  resources: providedResources
}: {
  crisisOnly?: boolean;
  supportOnly?: boolean;
  resources?: ResourceItem[];
}) {
  const sourceResources = providedResources ?? verifiedResources;
  const resources = crisisOnly
    ? sourceResources.filter((resource) => resource.crisis)
    : supportOnly
      ? sourceResources.filter((resource) => !resource.crisis)
      : sourceResources;

  return (
    <div className="space-y-3">
      {resources.map((resource) => (
        <article key={resource.title} className="rounded-xl border border-kompas-line bg-white/85 p-4">
          <h3 className="font-semibold">{resource.title}</h3>
          <p className="mt-1 text-sm leading-6 text-kompas-muted">{resource.description}</p>
          {resource.url ? (
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-kompas-green"
            >
              Bekijk bron
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}
