import { VercelLogo } from "@/ui/VercelLogo";

export const Byline = () => {
  return (
    <div className="flex items-center justify-between space-x-4 p-3.5 lg:px-5 lg:py-3">
      <div className="flex items-center space-x-1.5 text-sm text-gray-400">
        <span>Made by</span>
        <a
          className="text-gray-200 underline decoration-dotted underline-offset-4 hover:text-gray-50"
          href="https://github.com/tautastic"
          target="_blank"
          rel="noreferrer">
          Ahmed Sami
        </a>
      </div>

      <div className="text-xs tracking-wide text-gray-400">
        <a
          href="https://vercel.com"
          title="Vercel">
          <span>Powered by</span>
          <div className="mt-1 w-16 text-gray-200 hover:text-gray-50">
            <VercelLogo />
          </div>
        </a>
      </div>
    </div>
  );
};
