"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { StatusNotice } from "@/components/ui/status-notice";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Panel className="w-full max-w-lg p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <Image src="/vecta-mark.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" priority />
          <div>
            <p className="font-bold tracking-[-0.03em] text-slate-900">Vecta</p>
            <p className="text-xs text-slate-500">Your career, carried forward.</p>
          </div>
        </div>

        <StatusNotice tone="error" title="This workspace hit an unexpected problem.">
          Your locally saved profile and pipeline have not been removed. Try this view again, or return to the workspace.
        </StatusNotice>

        {error.digest && <p className="mt-4 text-xs text-slate-500">Reference: {error.digest}</p>}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button variant="primary" onClick={reset}>Try again</Button>
          <Button onClick={() => router.push("/")}>Return to workspace</Button>
        </div>
      </Panel>
    </main>
  );
}
