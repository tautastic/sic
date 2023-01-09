import { VercelLogo } from "@/ui/VercelLogo";

export const Byline = () => {
  return (
    <div className="flex items-center justify-between space-x-4 p-3.5 lg:px-5 lg:py-3">
      <div className="flex items-center space-x-1.5 text-sm">
        <div className="text-gray-400">Made by</div>
        <a
          className="underline decoration-dotted underline-offset-4 hover:text-gray-400"
          href="https://github.com/add1609"
          target="_blank"
          rel="noreferrer">
          Ahmed Sami
        </a>
      </div>

      <div className="text-xs tracking-wide text-gray-400">
        <a
          href="https://vercel.com"
          title="Vercel">
          Powered by
          <div className="mt-1 w-16 text-gray-100 hover:text-gray-50">
            <VercelLogo />
          </div>
        </a>
      </div>
    </div>
  );
};
