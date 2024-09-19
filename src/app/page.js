"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";

export default function Gallery() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    gsap.set("#motionSVG", { scale: 0.85, autoAlpha: 1 });
    gsap.set("#bee", { transformOrigin: "50% 50%", scaleX: -1 });

    let getProp = gsap.getProperty("#motionSVG"),
      flippedX = false,
      flippedY = false;

    gsap.to("#motionSVG", {
      scrollTrigger: {
        trigger: "#motionPath",
        start: "top center",
        end: "bottom center",
        scrub: 3,
        markers: false,
        onUpdate: (self) => {
          let rotation = getProp("rotation"),
            flipY = Math.abs(rotation) > 90,
            flipX = self.direction === 1;
          if (flipY !== flippedY || flipX !== flippedX) {
            gsap.to("#bee", {
              scaleY: flipY ? -1 : 1,
              scaleX: flipX ? -1 : 1,
              duration: 0.25,
            });
            flippedY = flipY;
            flippedX = flipX;
          }
        },
      },
      duration: 10,
      ease: pathEase("#motionPath", { smooth: true }),
      immediateRender: true,
      motionPath: {
        path: "#motionPath",
        align: "#motionPath",
        alignOrigin: [0.5, 0.5],
        autoRotate: 0,
      },
    });

    gsap.utils.toArray(".scroll-text").forEach((text, i) => {
      gsap.fromTo(
        text,
        { autoAlpha: 0, willChange: "opacity" },
        {
          autoAlpha: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: text,
            start: "top 90%",
            end: "bottom 10%",
            scrub: 5,
            markers: false,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    function pathEase(path, config = {}) {
      let axis = config.axis || "y",
        precision = config.precision || 1,
        rawPath = MotionPathPlugin.cacheRawPathMeasurements(
          MotionPathPlugin.getRawPath(gsap.utils.toArray(path)[0]),
          Math.round(precision * 12)
        ),
        useX = axis === "x",
        start = rawPath[0][useX ? 0 : 1],
        end =
          rawPath[rawPath.length - 1][
            rawPath[rawPath.length - 1].length - (useX ? 2 : 1)
          ],
        range = end - start,
        l = Math.round(precision * 200),
        inc = 1 / l,
        positions = [0],
        a = [],
        minIndex = 0,
        smooth = [0],
        minChange = (1 / l) * 0.6,
        smoothRange =
          config.smooth === true ? 7 : Math.round(config.smooth) || 0,
        fullSmoothRange = smoothRange * 2,
        getClosest = (p) => {
          while (positions[minIndex] <= p && minIndex++ < l) {}
          a.push(
            a.length &&
              ((p - positions[minIndex - 1]) /
                (positions[minIndex] - positions[minIndex - 1])) *
                inc +
                minIndex * inc
          );
          smoothRange &&
            a.length > smoothRange &&
            a[a.length - 1] - a[a.length - 2] < minChange &&
            smooth.push(a.length - smoothRange);
        },
        i = 1;

      for (; i < l; i++) {
        positions[i] =
          (MotionPathPlugin.getPositionOnPath(rawPath, i / l)[axis] - start) /
          range;
      }
      positions[l] = 1;

      for (i = 0; i < l; i++) {
        getClosest(i / l);
      }
      a.push(1);

      if (smoothRange) {
        smooth.push(l - fullSmoothRange + 1);
        smooth.forEach((i) => {
          let start = a[i],
            j = Math.min(i + fullSmoothRange, l),
            inc = (a[j] - start) / (j - i),
            c = 1;
          i++;
          for (; i < j; i++) {
            a[i] = start + inc * c++;
          }
        });
      }

      return (p) => {
        let i = p * l,
          s = a[i | 0];
        return i ? s + (a[Math.ceil(i)] - s) * (i % 1) : 0;
      };
    }
  }, []);

  return (
    <div style={{ backgroundColor: "#f7f2ef" }}>
      <div>
        <div
          style={{
            height: "45vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            flexDirection: "column",
            padding: "20px",
          }}
        >
          <div>
            <h1
              className="ghibli-bold-font text-4xl text-black"
              style={{
                height: "5vh",
              }}
            >
              A love letter to Arrietty
            </h1>
          </div>
          <div className="text-width" style={{ marginTop: "30px" }}>
            <p
              className="ghibli-font text-sm text-black"
              style={{ marginTop: "20px" }}
            >
              This gathering is inspired by the magic of simple pleasures, good
              food, good friend, and a sense of fulfillment, much like the
              feeling you get when watching a heartwarming Ghibli film.
              <br />
              <br />A Love Letter to Arrietty is my way of sharing the joy and
              comfort that comes from both delicious meals and cherished
              moments. I hope everyone who joins this lunch experiences the same
              warmth and contentment as when we savor a quiet, perfect day.
            </p>
          </div>
        </div>
      </div>

      <svg
        id="bee-scroll"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1588.4 3262.3"
      >
        <defs>
          <clipPath id="clipPath">
            <rect
              id="Rectangle_2885"
              data-name="Rectangle 2885"
              width="89.252"
              height="72.066"
              fill="none"
            />
          </clipPath>
        </defs>
        <style type="text/css">{`.st0 { fill: none; }`}</style>
        <path
          id="motionPath"
          className="st0"
          d=" M37.5 31C32.5 41.2 52.3 122.6 358 237.2 580.1 307 968.9 225.7 1219.3 319.7 1455.7 408.5 1536 531 1408 617 1028 820 873 348 318 610-602 1097 1505 736 1459 1016 1379 1503 107 617 57 1110-47 1729 854 929 1180 1357 1388 1689 105 1193 47 1525 3 2122 851 1294 1035 1718 1137 1944 231 1727 147 1997-43 2541 1252 1646 1470 1984 1572 2178 785 2355 791 2894"
          stroke="#000000"
          strokeMiterlimit="10"
          strokeWidth="5"
          strokeDasharray="25"
        />
        <g id="motionSVG" data-name="Group 1117">
          <g id="bee">
            <g id="Group_1025" data-name="Group 1025" clipPath="url(#clipPath)">
              <path
                id="Path_332"
                data-name="Path 332"
                d="M24.057,55.335c-7.948,5.428-11.332,14.306-7.56,19.829s13.273,5.6,21.22.172,11.332-14.306,7.56-19.829-13.273-5.6-21.22-.172"
                transform="translate(-11.365 -38.999)"
                fill="#FFD580"
              />
              <path
                id="Path_333"
                data-name="Path 333"
                d="M157.5,150.972c2.7-9.9-6.786-21.1-21.182-25.025s-28.253.919-30.95,10.816,6.786,21.1,21.182,25.025,28.253-.919,30.95-10.816"
                transform="translate(-79.734 -94.686)"
                fill="#FFD580"
              />
              <path
                id="Path_334"
                data-name="Path 334"
                d="M146.889,177.281s1.339-19.463,19.962-22.318"
                transform="translate(-111.637 -117.774)"
                fill="#FFD580"
              />
              <path
                id="Path_335"
                data-name="Path 335"
                d="M234.862,212.262s-6.479-13.1,4.49-21.97"
                transform="translate(-177.054 -144.624)"
                fill="#FFD580"
              />
              <path
                id="Path_336"
                data-name="Path 336"
                d="M190.35,61.76c-1.181,10.465,3.757,19.615,11.029,20.436s14.126-7,15.307-17.463S212.93,45.118,205.657,44.3s-14.126,7-15.307,17.463"
                transform="translate(-144.536 -33.621)"
                fill="#FFD580"
              />
              <path
                id="Path_337"
                data-name="Path 337"
                d="M216.247,95.353c-10.069,3.089-16.491,11.265-14.344,18.262s12.049,10.165,22.118,7.076,16.491-11.265,14.344-18.262-12.049-10.165-22.118-7.076"
                transform="translate(-153.134 -71.57)"
                fill="#FFD580"
              />
              <path
                id="Path_338"
                data-name="Path 338"
                d="M86.5,55.229a17.228,17.228,0,0,1-4.724-1.091,17.651,17.651,0,0,0-.645-6.232,23.879,23.879,0,0,0,4.336-4.227c3.459-4.4,4.6-9.332,3.2-13.876s-5.1-7.987-10.433-9.693a23.008,23.008,0,0,0-3.679-.842,23.054,23.054,0,0,0-1.586-3.7c-2.66-4.928-6.725-7.935-11.449-8.469s-9.357,1.492-13.049,5.7A27.053,27.053,0,0,0,42.4,26.543a33.332,33.332,0,0,0-4.365.8C39.7,22.664,39.288,18,36.885,14.477c-2.352-3.444-6.422-5.508-11.243-5.737-.9-2.254-3.321-6.9-8.276-8.331C13.03-.843,8.265.779,3.2,5.227a3.6,3.6,0,0,0,4.753,5.408c3-2.636,5.627-3.813,7.4-3.314A5.314,5.314,0,0,1,18.1,9.757a27.6,27.6,0,0,0-7.443,3.606A25.351,25.351,0,0,0,1.153,24.932C-.681,29.741-.314,34.575,2.158,38.195S9,43.915,14.146,43.956h.162a23.034,23.034,0,0,0,7.521-1.33c-.979,5.528.849,11.34,5.24,16.527a37.576,37.576,0,0,0,18.8,11.42,41.586,41.586,0,0,0,10.9,1.492,34.1,34.1,0,0,0,10.273-1.519c2.755-.572,8.829-3.2,19.9-14.04a.747.747,0,0,0-.444-1.278M60.718,14.253c2.515.284,4.653,2.2,6.085,5.034a30.848,30.848,0,0,0-4.746,1.054,28.717,28.717,0,0,0-11.038,6.209q-.644-.072-1.286-.122c1.5-7.293,6.234-12.709,10.985-12.176M8.1,34.134c-2.6-3.809.429-10.6,6.618-14.826a18.441,18.441,0,0,1,10.016-3.394h.1c1.618.013,4.563.371,6.1,2.623,2.6,3.809-.429,10.6-6.618,14.826s-13.616,4.58-16.218.771M32.527,54.457c-3.182-3.781-4.4-7.84-3.418-11.434s4.11-6.5,8.8-8.139a24.311,24.311,0,0,1,4.245-1.053,27.735,27.735,0,0,0,.769,4.52,26.315,26.315,0,0,0-7.884,9.432,33.191,33.191,0,0,0-2.515,6.673m19.819,5.728a25.528,25.528,0,0,0,.659,4.459,35.692,35.692,0,0,1-5.241-1.015,34.137,34.137,0,0,1-8.99-3.866l.068,0c.037-.492.779-9,7.059-14.556a18.408,18.408,0,0,0,1.752,2.272,15.776,15.776,0,0,0,5.823,4.426,20.908,20.908,0,0,0-1.13,8.275m21.949-4.846c-.983,3.608-4.11,6.5-8.8,8.139a24.708,24.708,0,0,1-5.013,1.161A15.724,15.724,0,0,1,60.5,53.767a26.421,26.421,0,0,0,2.691.138,29.952,29.952,0,0,0,8.746-1.343c.891-.273,1.76-.588,2.608-.933a9.679,9.679,0,0,1-.255,3.709m-4.464-9.66c-8.017,2.46-16.086.312-17.62-4.69-.92-3,.846-5.872,1.981-7.317a20.45,20.45,0,0,1,9.978-6.448A22.8,22.8,0,0,1,70.816,26.2c5.4,0,9.871,2.12,10.973,5.711.92,3-.846,5.872-1.981,7.317a20.455,20.455,0,0,1-9.978,6.448"
                transform="translate(0 0)"
                fill="#291f00"
              />
            </g>
          </g>
        </g>
        <text id="scrollText">
          <textPath
            className="ghibli-bold-menu-font text-5xl text-black scroll-text"
            href="#motionPath"
            startOffset="0.5%"
          >
            <tspan dy="-55" dx="0">
              I. Drink: Espresso | Cappuccino | Affogato | Red Wine
            </tspan>
          </textPath>

          <textPath
            style={{ color: "#f7f2ef" }}
            href="#motionPath"
            startOffset="15%"
          >
            <tspan dy="65" dx="0" rotate={180}>
              {"'".split("").reverse().join("")}
            </tspan>
          </textPath>

          <textPath
            className="ghibli-bold-menu-font text-5xl text-black scroll-text"
            href="#motionPath"
            startOffset="23.5%"
          >
            <tspan dy="-55" dx="0">
              II. Starter: Spaghetti alla Bolognese | Carbonara
            </tspan>
          </textPath>

          <textPath
            className="ghibli-bold-menu-font text-5xl text-black scroll-text"
            href="#motionPath"
            startOffset="6500"
          >
            <tspan dy="-35" dx="0">
              III. Main: Beefsteak
            </tspan>
          </textPath>

          <textPath
            className="ghibli-bold-menu-font text-5xl text-black scroll-text"
            href="#motionPath"
            startOffset="9200"
          >
            <tspan dy="50" dx="0">
              IV. Side: Potato Soup
            </tspan>
          </textPath>
          <textPath
            className="ghibli-bold-menu-font text-5xl text-black scroll-text"
            href="#motionPath"
            startOffset="11350"
          >
            <tspan dy="90" dx="0">
              V. Dessert: Red Velvet | Tiramisù | Cheese Cake
            </tspan>
          </textPath>
        </text>
      </svg>

      <div style={{ marginTop: "5px", width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h1 className="ghibli-bold-font text-xl text-black">
            Lunch 12:34 - Saturday - 28th of September
          </h1>
          <br />
          <h1
            className="ghibli-bold-font text-xl text-black"
            style={{
              marginTop: "30px",
            }}
          >
            Dresscode: Casual
          </h1>
          <br />
          <h1
            className="ghibli-bold-font text-xl text-black"
            style={{
              marginTop: "30px",
            }}
          >
            Kolfschotenstraat 172, 1104 PC Amsterdam
          </h1>
        </div>
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <a href="https://maps.app.goo.gl/Ggm6zRnr8dPAk5zX9">
            <FontAwesomeIcon
              icon={faMap}
              style={{ fontSize: "50px", color: "black" }}
            />
          </a>
        </div>
        <div style={{ height: "20vh" }}></div>
      </div>
    </div>
  );
}
