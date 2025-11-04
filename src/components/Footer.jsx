import AnimatedText from "./utils/AnimatedText";
import Socials from "./utils/Socials";

export default function Footer() {
  

  return (
    <div className="footer fixed bottom-0 w-full z-20 bg-black select-none">
      <footer className="flex items-end justify-between px-4 text-white">
            <div className="capitalize px-2 font-normal whitespace-nowrap">
                Darius Žvinklys. &copy; {new Date().getFullYear()} 
            </div>
            <Socials />
      </footer>
    </div>
  );
}
