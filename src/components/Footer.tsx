export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] py-8">
      <div className="mx-auto max-w-4xl px-4 text-center text-sm text-[var(--color-muted)]">
        <p>
          &copy; {new Date().getFullYear()} 99mini.{" "}
          <a
            href="https://github.com/99mini"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
