import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const portfolio = [
  {
    year: "2024",
    projects: [
      { name: "Project A", tags: "web design", img: "https://placehold.co/600x360" },
      { name: "Project B", tags: "branding", img: "https://placehold.co/600x360" },
      { name: "Project C", tags: "development", img: "https://placehold.co/600x360" },
    ],
  },
  {
    year: "2023",
    projects: [
      { name: "Project D", tags: "mobile app", img: "https://placehold.co/600x360" },
      { name: "Project E", tags: "ui/ux", img: "https://placehold.co/600x360" },
      { name: "Project F", tags: "animation", img: "https://placehold.co/600x360" },
    ],
  },
  {
    year: "2022",
    projects: [
      { name: "Project G", tags: "illustration", img: "https://placehold.co/600x360" },
      { name: "Project H", tags: "photography", img: "https://placehold.co/600x360" },
    ],
  },
];

// Placeholder Copy component
const Copy = ({ children }) => <>{children}</>;

// Placeholder Footer component
const Footer = () => <div className="p-6 text-center bg-gray-100">Footer Content</div>;

const WorkPage = () => {
  const workRef = useRef(null);

  const navigateToProject = (project) => {
    console.log("Navigate to:", project.name);
    // Add your navigation logic here
  };

  useGSAP(
    () => {
      const workContainers = workRef.current.querySelectorAll(".work-container");
      const yearIndices = document.querySelectorAll(".year-index");
      let initialAnimationComplete = false;

      const workProjects = workRef.current.querySelectorAll(".work-project");
      gsap.set(workProjects, { y: 100, opacity: 0 });
      gsap.to(workProjects, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        delay: 0.85,
        duration: 1,
        ease: "power3.out",
      });

      workContainers.forEach((container, index) => {
        ScrollTrigger.create({
          trigger: container,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => {
            if (!initialAnimationComplete) return;

            yearIndices.forEach((yearIndex) => {
              yearIndex.classList.remove("active");
              const highlighter = yearIndex.querySelector(".year-index-highlighter");
              gsap.to(highlighter, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.3,
                ease: "power2.out",
              });
            });

            if (yearIndices[index]) {
              yearIndices[index].classList.add("active");
              const highlighter = yearIndices[index].querySelector(".year-index-highlighter");
              gsap.to(highlighter, {
                scaleX: 1,
                transformOrigin: "left",
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
          onEnterBack: () => {
            if (!initialAnimationComplete) return;

            yearIndices.forEach((yearIndex) => {
              yearIndex.classList.remove("active");
              const highlighter = yearIndex.querySelector(".year-index-highlighter");
              gsap.to(highlighter, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.3,
                ease: "power2.out",
              });
            });

            if (yearIndices[index]) {
              yearIndices[index].classList.add("active");
              const highlighter = yearIndices[index].querySelector(".year-index-highlighter");
              gsap.to(highlighter, {
                scaleX: 1,
                transformOrigin: "left",
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
        });
      });

      yearIndices.forEach((yearIndex) => {
        const highlighter = yearIndex.querySelector(".year-index-highlighter");
        gsap.set(highlighter, { scaleX: 0 });
      });

      setTimeout(() => {
        let activeIndex = 0;
        workContainers.forEach((container, index) => {
          const rect = container.getBoundingClientRect();
          const containerCenter = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;

          if (containerCenter <= viewportCenter) {
            activeIndex = index;
          }
        });

        if (yearIndices[activeIndex]) {
          yearIndices[activeIndex].classList.add("active");
          const highlighter = yearIndices[activeIndex].querySelector(".year-index-highlighter");
          gsap.to(highlighter, {
            scaleX: 1,
            transformOrigin: "left",
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              initialAnimationComplete = true;
            },
          });
        }
      }, 1000);

      if (window.innerWidth > 1000) {
        const workYears = workRef.current.querySelectorAll(".work-year");
        workYears.forEach((workYear) => {
          ScrollTrigger.create({
            trigger: workYear,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              gsap.to(workYear, {
                y: self.progress * -100,
                duration: 0.3,
                ease: "none",
              });
            },
          });
        });
      }
    },
    { scope: workRef }
  );

  return (
    <>
      <style>{`
        .year-index.active {
          color: #111827;
        }
      `}</style>
      
      <div className="flex p-6 bg-white text-gray-900 min-h-screen" ref={workRef}>
        {/* Year Indices */}
        <div className="fixed top-[30vh] lg:top-[30vh] left-6 flex flex-col gap-2 lg:gap-4 z-10">
          {portfolio.map((yearData, yearIndex) => (
            <div
              key={yearIndex}
              className={`year-index relative flex flex-col text-gray-400 transition-colors duration-300 w-max ${
                yearIndex % 2 === 0 ? "ml-0" : "ml-8"
              }`}
            >
              <Copy>
                <p className="text-sm">{yearData.year}</p>
              </Copy>
              <div 
                className="year-index-highlighter w-full h-[1.5px] bg-gray-900"
                style={{ transform: "scaleX(0)", transformOrigin: "left" }}
              ></div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="flex-1"></div>

        {/* Main Content */}
        <div className="flex-[3] my-[17.5vh] lg:my-[17.5vh] mb-[5vh]">
          {portfolio.map((yearData, yearIndex) => (
            <div key={yearIndex} className="work-container mb-[7.5rem]">
              {/* Year Title */}
              <div className="mb-6 lg:mb-0">
                <Copy>
                  <h1 
                    className="work-year text-6xl lg:text-8xl font-bold relative top-0 left-0 lg:top-32 lg:left-28 z-[1] mb-6 lg:mb-0"
                    style={{ 
                      maxWidth: "20ch", 
                      overflowWrap: "break-word",
                      willChange: "transform"
                    }}
                  >
                    {yearData.year}
                  </h1>
                </Copy>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {yearData.projects.map((project, projectIndex) => (
                  <div
                    key={projectIndex}
                    className="work-project flex flex-col mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigateToProject(project)}
                  >
                    {/* Project Image */}
                    <div className="aspect-[5/3] overflow-hidden mb-3 rounded-lg">
                      <img
                        src={project.img}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Project Info */}
                    <div className="flex flex-col gap-1 break-words">
                      <p className="text-sm font-medium">{project.name}</p>
                      <p className="text-sm capitalize text-gray-500">
                        {project.tags}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WorkPage;