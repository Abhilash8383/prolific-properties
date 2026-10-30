export default function PropertyLoading() {
  return (
    <div className="bg-surface pb-28 lg:pb-20">
      <div className="container-x pt-5 md:pt-8">
        <div className="h-4 w-48 animate-pulse rounded bg-line" />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0 space-y-3">
            <div className="h-3 w-40 animate-pulse rounded bg-line" />
            <div className="h-10 w-72 max-w-full animate-pulse rounded bg-line md:h-12 md:w-96" />
            <div className="h-4 w-48 animate-pulse rounded bg-line" />
          </div>
          <div className="space-y-2 sm:text-right">
            <div className="h-3 w-20 animate-pulse rounded bg-line" />
            <div className="h-8 w-32 animate-pulse rounded bg-line" />
          </div>
        </div>
        <div className="mt-6 aspect-video animate-pulse rounded-3xl bg-line" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="h-80 animate-pulse rounded-3xl bg-line" />
          <div className="h-80 animate-pulse rounded-3xl bg-line" />
        </div>
      </div>
    </div>
  );
}
