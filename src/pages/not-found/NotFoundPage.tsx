import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section className="mx-auto flex h-full w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 text-center">
      <p className="text-sm uppercase tracking-[0.4em] text-muted">404</p>
      <h1 className="text-balance font-display text-3xl text-foreground sm:text-4xl">
        The portal you tried to access is offline.
      </h1>
      <p className="text-muted">
        Double-check the route name or jump back to HQ to continue configuring the game systems.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full bg-primary/90 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary"
      >
        Return to HQ
        <span aria-hidden className="translate-y-[-1px]">↺</span>
      </Link>
    </section>
  )
}

export default NotFoundPage
