import appConfig from "./app.config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex h-[44px] items-center justify-center px-6 py-1 text-center text-sm">
      <span className="text-gray-400">
        {`©${currentYear} ${appConfig.name}, Inc. All rights reserved.`}
      </span>
    </footer>
  );
}
