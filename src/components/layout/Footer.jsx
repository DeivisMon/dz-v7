import AnimatedText from "../utils/AnimatedText";
import Socials from "../utils/Socials";
import { useLocation } from "react-router-dom";
import { LuArrowBigLeftDash, LuArrowBigRightDash } from "react-icons/lu";
import { useResponsive } from "../hooks/useResopnsive";



export default function Footer() {
    const location = useLocation();
  const responsive = useResponsive();

  
    const getPath = () => (
      location.pathname === "/" ? "flex" : "hidden"
    );

  return (
    <div className="footer fixed bottom-0 w-full z-20 select-none">
      <footer className="flex items-end justify-between text-white mix-blend-difference">
        {responsive.isDesktop ?  <div className="capitalize font-normal pl-4 whitespace-nowrap">
              Žvinklys. &copy; {new Date().getFullYear()}
            </div> : null}
            <span className={`${getPath()} fixed -bottom-1 left-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center gap-2 text-lg xl:text-2xl animate-pulse`}>
              <LuArrowBigLeftDash />
              {responsive.isDesktop ? <span>Scroll</span> : <span>Swipe</span> }
              <LuArrowBigRightDash />
            </span>
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
