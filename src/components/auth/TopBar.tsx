import Link from "next/link";
import { LanguageSwitcher } from "../LanguageSwitcher";

const TopBar = () => {
  return (
    <nav className="h-16 w-full flex justify-between items-center">
      <div>
        <Link
          href="/eng/home"
          className="text-3xl font-bold text-black tracking-wide"
        >
          LevelUp
        </Link>
      </div>

      <div className="flex items-center gap-4 ml-3">
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default TopBar;
