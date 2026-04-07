import AnimatedText from "../utils/AnimatedText";
import Socials from "../utils/Socials";
import { useLocation } from "react-router-dom";
import { LuArrowBigLeftDash, LuArrowBigRightDash } from "react-icons/lu";
import { useResponsive } from "../hooks/useResopnsive";

export default function Footer() {
  const location = useLocation();
  const responsive = useResponsive();

  const getPath = () => (location.pathname === "/" ? "flex" : "hidden");

  return (
    <div className="footer fixed bottom-0 w-full z-[100] select-none bg-black mix-blend-difference">
      <footer className="flex items-end justify-between">
        {responsive.isDesktop ? (
          <div className="capitalize text-accent font-normal pl-4 whitespace-nowrap ">
            Žvinklys. &copy; {new Date().getFullYear()}
          </div>
        ) : null}
        <div
          className={`${getPath()} fixed text-muted -bottom-4 left-1/2 transform -translate-y-1/2 -translate-x-1/2 flex items-center text-lg xl:text-md animate-pulse`}
        >
          <LuArrowBigLeftDash size={24} className="pb-1" />
          {responsive.isDesktop ? <span>Scroll</span> : <span>Swipe</span>}
          <LuArrowBigRightDash size={24} className="pb-1" />
        </div>
        <Socials />
        {/* <div
            className="relative z-10 capitalize font-normal whitespace-nowrap"
            style={{ paddingLeft: isHorizontalMobile ? "0.5rem" : "0" }}
          >
            Darius Žvinklys. &copy; {new Date().getFullYear()}
          </div> */}
      </footer>
    </div>
  );
}
