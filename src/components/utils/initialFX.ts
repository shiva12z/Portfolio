import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenis } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (lenis) {
    lenis.start();
  }

  const main = document.getElementsByTagName("main")[0];
  if (main) {
    main.classList.add("main-active");
  }

  gsap.set(".landing-container", { opacity: 1, y: 0 });
  gsap.set([".header", ".icons-section", ".nav-fade"], { opacity: 1 });

  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });

  const selectors = [
    ".landing-info h3",
    ".landing-intro h2",
    ".landing-intro h1",
  ];
  const elements = selectors.flatMap((selector) =>
    Array.from(document.querySelectorAll(selector))
  );

  if (elements.length > 0) {
    const landingText = new TextSplitter(elements, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    gsap.fromTo(
      landingText.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    );
  }

  const textProps = { type: "chars,lines", linesClass: "split-h2" };

  const landingH2Info = document.querySelector(".landing-h2-info");
  if (landingH2Info) {
    const landingText2 = new TextSplitter(".landing-h2-info", textProps);
    gsap.fromTo(
      landingText2.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    );
  }

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const landingH21 = document.querySelector(".landing-h2-1");
  const landingH22 = document.querySelector(".landing-h2-2");
  const landingH2Info1 = document.querySelector(".landing-h2-info-1");

  if (landingH2Info && landingH2Info1) {
    LoopText(
      new TextSplitter(".landing-h2-info", textProps),
      new TextSplitter(".landing-h2-info-1", textProps)
    );
  }

  if (landingH21 && landingH22) {
    LoopText(
      new TextSplitter(".landing-h2-1", textProps),
      new TextSplitter(".landing-h2-2", textProps)
    );
  }

  ScrollTrigger.refresh();
}

function LoopText(text1: TextSplitter, text2: TextSplitter) {
  if (text1.chars.length === 0 || text2.chars.length === 0) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
