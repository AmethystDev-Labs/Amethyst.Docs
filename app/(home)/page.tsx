import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { ArrowRightIcon, KeyRoundIcon, PlugIcon, ServerIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CodeBlock } from '@/components/code-block';

const headingVariants = cva('font-medium tracking-tight', {
  variants: {
    variant: {
      h2: 'text-3xl lg:text-4xl',
      h3: 'text-xl lg:text-2xl',
    },
  },
});

const buttonVariants = cva(
  'inline-flex items-center justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-brand-foreground hover:bg-brand-200',
        secondary: 'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const cardVariants = cva('rounded-2xl text-sm p-6 bg-origin-border shadow-lg', {
  variants: {
    variant: {
      secondary: 'bg-brand-secondary text-brand-secondary-foreground',
      default: 'border bg-fd-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export default function Page() {
  return (
    <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
      <div className="relative border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-origin-border">
        <div className="flex flex-col px-4 py-10 md:p-12">
          <p className="text-xs text-brand font-medium rounded-full px-3 py-2 border border-brand/50 w-fit">
            Amethyst Docs
          </p>
          <h1 className="text-4xl mt-6 leading-tighter font-medium xl:text-5xl">
            面向开发者的 API 文档
            <br />
            <span className="text-brand">AI API（OpenAI 兼容）</span> 与 <span className="text-brand">Dev.Fanqie</span>
          </h1>
          <p className="mt-4 max-w-[900px] text-sm text-fd-muted-foreground">
            这里收录了 Amethyst 相关服务的接口说明与示例：可直接替换 OpenAI SDK 的 Base URL，也提供 Dev.Fanqie（番茄小说服务）API。
          </p>
          <div className="mt-8 flex flex-row items-center gap-3 flex-wrap">
            <Link href="/docs/" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              进入文档 <ArrowRightIcon className="ml-2 size-4" />
            </Link>
            <Link
              href="/docs/ai-api/"
              className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}
            >
              AI API 快速开始
            </Link>
            <Link
              href="/docs/dev-fanqie/"
              className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}
            >
              Dev.Fanqie API
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <div className={cn(cardVariants(), 'col-span-full')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>快速入口</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Link href="/docs/ai-api/" className={cn(cardVariants(), 'hover:bg-fd-accent')}>
              <div className="flex items-center gap-2">
                <PlugIcon className="size-4 text-brand" />
                <p className="font-medium">AI API（OpenAI 兼容）</p>
              </div>
              <p className="mt-2 text-xs text-fd-muted-foreground">
                BaseURL：<span className="font-mono">https://ai.amethyst.ltd/v1</span>
              </p>
              <p className="mt-2 text-sm">
                路径、字段命名、响应结构与 OpenAI API 保持一致，SDK 仅需替换 Base URL。
              </p>
            </Link>

            <Link href="/docs/dev-fanqie/" className={cn(cardVariants(), 'hover:bg-fd-accent')}>
              <div className="flex items-center gap-2">
                <ServerIcon className="size-4 text-brand" />
                <p className="font-medium">Dev.Fanqie（FQNovel Service API）</p>
              </div>
              <p className="mt-2 text-xs text-fd-muted-foreground">
                BaseURL：<span className="font-mono">https://fq.amethysty.dev</span>
              </p>
              <p className="mt-2 text-sm">提供健康检查、章节获取、批量章节等接口。</p>
            </Link>
          </div>
        </div>

        <div className={cn(cardVariants(), 'flex flex-col')}>
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>AI API 快速开始</h3>
          <p className="mb-4 text-sm text-fd-muted-foreground">
            使用 <span className="font-mono">Authorization: Bearer &lt;API_KEY&gt;</span>，调用 Chat Completions。
          </p>
          <CodeBlock
            code={`curl https://ai.amethyst.ltd/v1/chat/completions \\\n  -H "Authorization: Bearer $AI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "model": "gpt-4o-mini",\n    "messages": [\n      { "role": "system", "content": "You are a helpful assistant." },\n      { "role": "user", "content": "Hello!" }\n    ]\n  }'`}
            lang="bash"
          />
          <div className="mt-4 flex gap-2 text-xs text-fd-muted-foreground">
            <KeyRoundIcon className="mt-0.5 size-4 text-brand" />
            <p>Key 与通用约定见：/docs/ai-api/authentication</p>
          </div>
        </div>

        <div className={cn(cardVariants({ variant: 'secondary' }), 'flex flex-col')}>
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-3' }))}>Dev.Fanqie 示例</h3>
          <p className="mb-4 text-sm opacity-90">健康检查接口：</p>
          <CodeBlock code="GET /api/fqnovel/health" lang="bash" />
          <p className="mt-4 text-sm opacity-90">查看完整接口与 Playground：</p>
          <Link href="/docs/dev-fanqie/" className={cn(buttonVariants({ variant: 'secondary' }), 'mt-3')}>
            打开 Dev.Fanqie 文档 <ArrowRightIcon className="ml-2 size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
