import AnimatedText from "../utils/AnimatedText";
import Socials from "../utils/Socials";
import { useLocation } from "react-router-dom";
import { LuArrowBigLeftDash, LuArrowBigRightDash } from "react-icons/lu";
import { CgArrowsExchange } from "react-icons/cg";
import { useResponsive } from "../hooks/useResopnsive";

export default function Footer() {
  const location = useLocation();
  const responsive = useResponsive();

  const getPath = () => (location.pathname === "/" ? "flex" : "hidden");

  return (
    <div className="footer fixed bottom-0 w-full z-[100] select-none bg-black/75 backdrop-blur-xl">
      <footer className="flex items-end pl-4 justify-between">
        {responsive.isDesktop ? (
          <div className="text-muted whitespace-nowrap ">
            Žvinklys. &copy; {new Date().getFullYear()}
          </div>
        ) : ( null)}
        <div
          className={`${getPath()} fixed text-muted -bottom-5 left-1/2 transform -translate-y-1/2 -translate-x-1/2 flex items-center text-lg xl:text-md animate-pulse`}
        >
          {/* <LuArrowBigLeftDash size={24} className="-pb-1" />
          {responsive.isDesktop ? <span>Drag/Scroll</span> : <span>Swipe</span>}
          <LuArrowBigRightDash size={24} className="-pb-1" /> */}
          <CgArrowsExchange size={32}/>
        </div>
        <Socials />
      </footer>
    </div>
  );
}
