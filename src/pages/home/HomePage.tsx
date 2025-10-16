import { Link } from 'react-router-dom'

import { navigationItems } from '@/data/navigation'

const HomePage = () => {
  return (
    <section className="space-y-12">
      <header className="flex flex-col gap-6 text-center md:text-left">
        <p className="inline-flex items-center justify-center rounded-full border border-border bg-surface/80 px-4 py-1 text-xs uppercase tracking-[0.4em] text-muted shadow-sm backdrop-blur-2xl md:self-start">
          Mission Control
        </p>
        <div className="space-y-4">
          <h1 className="font-display text-3xl leading-tight text-primary sm:text-4xl md:text-5xl">
            Assemble your dream arcade experience
          </h1>
          <p className="text-lg text-muted md:max-w-2xl">
            Start wiring up the core systems for your web game. The toolkit is preloaded with a
            modern React stack, so you can stay focused on crafting a polished gameplay loop.
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-surface/80 p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">
              {item.label}
            </span>
            <p className="text-lg font-semibold text-foreground group-hover:text-primary">
              {item.description}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              Enter
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default HomePage
