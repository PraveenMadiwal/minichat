import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen pt-20 px-4 container mx-auto max-w-5xl">
      <div className="space-y-8">
        {/* Theme section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>

        {/* Theme grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`group flex flex-col items-center gap-2 p-2 rounded-lg border transition-colors ${
                theme === t ? "bg-base-200 border-primary" : "hover:bg-base-200/50"
              }`}
            >
              <div
                data-theme={t}
                className="relative h-10 w-full rounded grid grid-cols-4 overflow-hidden"
              >
                <div className="bg-primary" />
                <div className="bg-secondary" />
                <div className="bg-accent" />
                <div className="bg-neutral" />
              </div>
              <span className="text-xs font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default SettingsPage;
