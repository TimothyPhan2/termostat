import Link from "next/link";
import { Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div className="flex flex-col min-h-[100vh] bg-base-800">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center">
          <Thermometer className="h-6 w-6" />
          <span className="sr-only">Termometer</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Termometer
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                A captivating word association game that challenges your vocabulary and word relativity skills. Are you getting hotter or colder?
                </p>
              </div>
              <Button>
                
                <Link
                  href="/game"
                  className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium text-primary-foreground shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Play Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Termometer. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
