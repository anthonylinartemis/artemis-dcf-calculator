interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b
      border-artemis-border dark:border-artemis-dark-border
      bg-artemis-card dark:bg-artemis-dark-card">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src="/logo/Purple gradient icon.jpg"
          alt="Artemis"
          className="w-7 h-7 rounded-lg"
        />
        <span className="text-base font-semibold text-artemis-text dark:text-artemis-dark-text">
          Artemis DCF
        </span>
      </div>

      {/* Right: Dark mode toggle */}
      <button
        onClick={onToggleDarkMode}
        className="p-1.5 rounded-lg
          text-artemis-text-muted dark:text-artemis-dark-text-muted
          hover:bg-artemis-bg dark:hover:bg-artemis-dark-bg"
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </header>
  );
}
