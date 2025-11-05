import AnimatedText from "./utils/AnimatedText";
import Socials from "./utils/Socials";

export default function Footer() {
  

  return (
    <div className="footer fixed bottom-0 w-full z-20 select-none">
      <footer className="flex items-end justify-center md:justify-between text-white">
            <div className="relative z-10 capitalize font-normal pl-4 whitespace-nowrap">
                Darius Žvinklys. &copy; {new Date().getFullYear()} 
            </div>
            <span className="fixed bottom-0 bg-black h-2 w-full"></span>
            <Socials />
      </footer>
    </div>
  );
}
