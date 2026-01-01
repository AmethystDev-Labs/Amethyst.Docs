import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Amethyst Docs
        </h1>
        <p className="mt-4 text-fd-muted-foreground sm:text-lg">
          Product documentation, guides, and references for the Amethyst
          ecosystem.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex h-10 items-center justify-center rounded-md bg-fd-primary px-4 text-sm font-medium text-fd-primary-foreground"
          >
            Get started
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-10 items-center justify-center rounded-md border border-fd-border px-4 text-sm font-medium"
          >
            Browse docs
          </Link>
        </div>

        <p className="mt-6 text-xs text-fd-muted-foreground">
          Looking for something specific? Use the docs search in the top bar.
        </p>
      </div>
    </main>
  );
}
