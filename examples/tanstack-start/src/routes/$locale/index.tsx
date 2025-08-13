import { createFileRoute } from '@tanstack/react-router';
import { LocalesValues } from 'intlayer';
import { useIntlayer } from 'react-intlayer';

export const Route = createFileRoute('/$locale/')({
  component: App,
});

function App() {
  const { locale } = Route.useParams() as { locale: LocalesValues };
  const { edit, learnReact, learnTanStack } = useIntlayer('app', locale);

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        {/* <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <p>{edit}</p> */}
        {/* <a
          className="text-[#61dafb] hover:underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {learnReact.linkText}
        </a> */}
        <a
          className="text-[#61dafb] hover:underline"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          {learnTanStack.linkText}
        </a>
      </header>
    </div>
  );
}
