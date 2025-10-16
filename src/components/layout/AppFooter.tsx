const AppFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-surface/70 py-6 text-sm text-muted">
      <div className="container flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <p>&copy; {year} Game Grid. Crafted for rapid prototyping.</p>
        <p className="text-xs md:text-sm">
          Made with modern React, Tailwind CSS, and Vitest tooling.
        </p>
      </div>
    </footer>
  )
}

export default AppFooter
