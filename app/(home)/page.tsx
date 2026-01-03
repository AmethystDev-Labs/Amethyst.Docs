import Link from 'next/link';
import { ArrowRight, BookOpen, Braces, HeartHandshake } from 'lucide-react';
import type { ReactNode } from 'react';

export default function HomePage() {
  return (
    <main className="pt-4 pb-6 md:pb-12">
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-12">
        <div className="relative overflow-hidden rounded-2xl border bg-fd-card">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,190,28,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(223,63,0,0.20),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(57,190,28,0.20),transparent_55%),radial-gradient(circle_at_bottom,rgba(223,63,0,0.18),transparent_55%)]" />
          <div className="relative flex min-h-[560px] flex-col items-start justify-center px-4 py-12 md:min-h-[640px] md:px-12 md:py-16">
            <p className="rounded-full border border-fd-border bg-fd-background/60 px-3 py-2 text-xs font-medium text-fd-muted-foreground backdrop-blur">
              Dev.Fanqie — FQNovel Service API
            </p>
            <h1 className="mt-8 text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Build excellent
              <br className="md:hidden" /> API docs,
              <br />
              your <span className="text-fd-primary">style</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-fd-muted-foreground md:text-lg">
              一个面向开发者的接口文档与 Playground 页面：复制 BaseURL、选择接口、填参数、直接发请求。
            </p>

            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/docs"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground sm:w-auto"
              >
                Get started <ArrowRight className="size-4" />
              </Link>
              <a
                href="https://fq.amethysty.dev/api/fqnovel/health"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-fd-border bg-fd-secondary px-6 text-sm font-medium text-fd-secondary-foreground hover:bg-fd-accent sm:w-auto"
              >
                Health check <HeartHandshake className="size-4" />
              </a>
            </div>

            <div className="mt-10 w-full max-w-2xl rounded-xl border bg-fd-background/60 p-4 font-mono text-xs text-fd-foreground backdrop-blur sm:text-sm">
              <div className="text-fd-muted-foreground">Try it out</div>
              <div className="mt-2 overflow-auto whitespace-pre">
                curl "https://fq.amethysty.dev/api/fqnovel/health"
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid w-full max-w-[1400px] grid-cols-1 gap-6 px-6 md:px-12 lg:grid-cols-3">
        <FeatureCard
          icon={<BookOpen className="size-5" />}
          title="Single page docs"
          description="核心文档集中在一个 Dev.Fanqie 页面里，结构清晰。"
        />
        <FeatureCard
          icon={<Braces className="size-5" />}
          title="Playground"
          description="选择接口、自动拼 URL、POST JSON 校验、响应可滚动查看。"
        />
        <FeatureCard
          icon={<HeartHandshake className="size-5" />}
          title="Dev friendly"
          description="面向开发者的参数说明与示例请求，直接可用。"
        />
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-fd-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border bg-fd-secondary text-fd-secondary-foreground">
          {icon}
        </div>
        <div className="text-base font-medium tracking-tight">{title}</div>
      </div>
      <p className="mt-4 text-sm text-fd-muted-foreground">{description}</p>
    </div>
  );
}
