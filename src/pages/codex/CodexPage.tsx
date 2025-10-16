const CodexPage = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">Codex</h1>
        <p className="text-muted md:max-w-2xl">
          The codex is the living documentation for your world. Track mechanics, entities, and
          balancing notes here while the game loop evolves.
        </p>
      </div>

      <article className="rounded-2xl border border-border/60 bg-surface/80 p-6 shadow-card">
        <h2 className="text-lg font-semibold text-foreground">Game loop checklist</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
          <li>• Define your win and fail states.</li>
          <li>• Prototype core interactions using the shared UI primitives.</li>
          <li>• Connect state management to persist progression.</li>
          <li>• Iterate on difficulty curves using the data layer.</li>
        </ul>
      </article>
    </section>
  )
}

export default CodexPage
