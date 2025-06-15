import GoTrackLogo from '@/components/GoTrackLogo';
import KanbanBoard from '@/components/KanbanBoard';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center">
            <GoTrackLogo className="h-10 w-10 mr-3" />
            <h1 className="text-2xl font-headline font-bold text-primary-foreground">
              GoTrack<span className="text-primary">Agile</span>
            </h1>
          </div>
          {/* Action buttons moved to KanbanBoard for better context */}
        </div>
      </header>
      <main className="flex-grow">
        <KanbanBoard />
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-background border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Firebase Studio. Inspired by GoComet.
          </p>
        </div>
      </footer>
    </div>
  );
}
