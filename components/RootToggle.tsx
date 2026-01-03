'use client';

import Link from 'fumadocs-core/link';
import { usePathname } from 'fumadocs-core/framework';
import { useMemo, useRef } from 'react';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { getSidebarTabs } from 'fumadocs-ui/utils/get-sidebar-tabs';

function normalizePathname(input: string) {
  const pathname = input.split(/[?#]/)[0] ?? '';
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

function isTabActive(tab: { url: string; urls?: Set<string> }, pathname: string) {
  const current = normalizePathname(pathname);

  if (tab.urls) {
    for (const url of tab.urls) {
      if (normalizePathname(url) === current) return true;
    }
  }

  return normalizePathname(tab.url) === current;
}

export default function RootToggle() {
  const pathname = usePathname();
  const { full } = useTreeContext();
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const options = useMemo(() => getSidebarTabs(full), [full]);
  const selected = useMemo(
    () => options.findLast((opt) => isTabActive(opt, pathname)),
    [options, pathname],
  );

  if (options.length === 0) return null;

  return (
    <details ref={detailsRef} className="group relative">
      <summary className="list-none [&::-webkit-details-marker]:hidden">
        <div className="flex w-full cursor-pointer items-center gap-2 rounded-lg border bg-fd-secondary/50 p-2 text-start text-fd-secondary-foreground transition-colors hover:bg-fd-accent group-open:bg-fd-accent group-open:text-fd-accent-foreground">
          <div className="size-9 shrink-0 empty:hidden md:size-5">{selected?.icon}</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{selected?.title ?? '选择板块'}</p>
            <p className="truncate text-sm text-fd-muted-foreground empty:hidden md:hidden">
              {selected?.description ?? '切换到其他文档根目录'}
            </p>
          </div>
          <span className="ms-auto shrink-0 text-fd-muted-foreground">▾</span>
        </div>
      </summary>

      <div className="absolute left-0 right-0 z-50 mt-2 flex flex-col gap-1 rounded-lg border bg-fd-popover p-1 text-fd-popover-foreground shadow-lg">
        {options.map((opt) => {
          const active = selected?.url === opt.url;
          if (!active && opt.unlisted) return null;

          return (
            <Link
              key={opt.url}
              href={opt.url}
              onClick={() => {
                if (detailsRef.current) detailsRef.current.open = false;
              }}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <div className="size-9 shrink-0 empty:hidden md:mb-auto md:size-5">{opt.icon}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-none">{opt.title}</p>
                <p className="mt-1 line-clamp-2 text-[0.8125rem] text-fd-muted-foreground empty:hidden">
                  {opt.description}
                </p>
              </div>
              <span
                className={[
                  'ms-auto shrink-0 text-fd-primary',
                  active ? 'visible' : 'invisible',
                ].join(' ')}
              >
                ✓
              </span>
            </Link>
          );
        })}
      </div>
    </details>
  );
}
