import ThemeSwitcherRadioGroup from "./_components/theme-switcher-radio-group";

const SettingsPage = () => {
  return (
    <div>
      <div className="h-[100px] flex items-center">
        <h1 className="text-3xl font-semibold tracking-wide">Settings</h1>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-bold">Change theme</h3>
        <ThemeSwitcherRadioGroup />
      </div>
    </div>
  );
};

export default SettingsPage;
