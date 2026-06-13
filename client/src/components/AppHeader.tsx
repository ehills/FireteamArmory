import { Link, useLocation } from 'wouter';
import { GiTank } from 'react-icons/gi';

export default function AppHeader() {
  const [location] = useLocation();

  return (
    <header className="bg-dark-400 border-b border-dark-200 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Brand */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <GiTank className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-foreground leading-none tracking-wider">
                  FIRE TEAM 1942
                </h1>
                <p className="text-[10px] text-muted-foreground leading-none mt-1 tracking-widest uppercase font-semibold text-primary/80">
                  ARMY BUILDER
                </p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <Link href="/">
              <span className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                location === '/'
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-dark-300'
              }`}>
                Roster Builder
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
