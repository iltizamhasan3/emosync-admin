export default function Header({ title, description }) {
  return (
    <div className="mb-12 flex flex-col gap-2">
      <h1 className="typography-display-lg text-[var(--color-ink)]">{title}</h1>
      {description && (
        <p className="typography-body-md text-[var(--color-muted)]">{description}</p>
      )}
    </div>
  )
}
