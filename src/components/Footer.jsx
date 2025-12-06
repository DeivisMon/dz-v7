import AnimatedText from "./utils/AnimatedText";
import Socials from "./utils/Socials";
import { CgScrollH } from "react-icons/cg";
import { useDeviceType } from "./utils/useDeviceType";
import { useLocation } from "react-router-dom";


export default function Footer() {
  const { isMobile, isHorizontalMobile } = useDeviceType();
    const location = useLocation();
  
    const getPath = () => (
      location.pathname === "/" ? "flex" : "hidden"
    );

  return (
    <div className="footer fixed bottom-0 w-full z-20 select-none mix-blend-difference">
      <footer className="flex items-end justify-center md:justify-between text-white">
        {!isMobile ? (
          <>
            <div className="relative z-10 capitalize font-normal whitespace-nowrap">
              Darius Žvinklys. &copy; {new Date().getFullYear()}
            </div>
            <span className={`${getPath()} fixed bottom-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center gap-2 text-2xl animate-pulse`}>
              <CgScrollH size={36} />
              <span>Scroll</span>
              <CgScrollH size={36} />
            </span>
            <Socials />{" "}
          </>
        ) : (
          <div
            className="relative z-10 capitalize font-normal whitespace-nowrap"
            style={{ paddingLeft: isHorizontalMobile ? "0.5rem" : "0" }}
          >
            Darius Žvinklys. &copy; {new Date().getFullYear()}
          </div>
        )}
      </footer>
    </div>
  );
}
