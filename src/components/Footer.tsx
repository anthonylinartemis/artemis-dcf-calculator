export default function Footer() {
  return (
    <footer className="px-4 py-6 text-center text-xs
      text-artemis-text-muted dark:text-artemis-dark-text-muted
      border-t border-artemis-border dark:border-artemis-dark-border">
      <p>
        Financial data &amp; live prices provided by{' '}
        <a href="https://www.artemis.xyz" target="_blank" rel="noopener noreferrer"
          className="text-artemis-accent dark:text-artemis-dark-accent hover:underline">
          Artemis
        </a>
      </p>
      <p className="mt-1">
        For informational purposes only. Not financial advice. Always do your own research.
      </p>
    </footer>
  );
}
