import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceLoading() {
  return (
    <div className="min-h-screen text-slate-900" role="status" aria-live="polite" aria-label="Loading your Vecta workspace">
      <header className="border-b border-slate-200/80 bg-[#F8FAFC]/92">
        <div className="mx-auto flex h-[72px] max-w-[1700px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image src="/vecta-mark.png" alt="" width={40} height={40} className="h-9 w-9 object-contain" priority />
            <div>
              <p className="font-bold tracking-[-0.03em]">Vecta</p>
              <p className="text-xs text-slate-500">Preparing your workspace…</p>
            </div>
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1700px] space-y-7 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-24 rounded-2xl" />)}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <Skeleton className="hidden h-10 w-32 sm:block" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton key={item} className="h-48 rounded-2xl" />)}
          </div>
        </div>
        <span className="sr-only">Loading your workspace</span>
      </main>
    </div>
  );
}
