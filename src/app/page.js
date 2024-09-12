"use client"; // Ensure this component runs on the client side

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import React from "react";

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
        scrub: 0.7,
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
    <div style={{ backgroundColor: "#f0f0f0" }}>
      <div>
        <div
          style={{
            height: "45vh",
            display: "flex",
            alignItems: "center", // Center vertically
            justifyContent: "center", // Center horizontally
            textAlign: "center",
          }}
        >
          <h1 className="comic-neue-bold text-4xl">
            A love letter for Arrietty
          </h1>
        </div>
      </div>

      <svg
        id="bee-scroll"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1588.4 2762.3"
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
          d="M37.5,31C32.5,41.2,52.3,122.6,358,237.2c222.1,69.8,610.9-11.5,861.3,82.5
                                       c236.4,88.8,340.3,257.8,323.7,416.2c-19.9,209.7-162.4,595.6-340.4,613.1c-106.6-36.6-174.3,34.9-127.1,196.4
                                       c-24.6,284.5-286.8,140-346.4,140c-182.9-15.9-269.3,213.5-155.7,344.2c118,135.7,31.2,223.3,392,144.9
                                       c158.4-34.4,182.2,81,177.4,136.5c-26.9,51.3-27.4,334.3-150.7,382.5c-112.9,44.1-263.8-30.3-397.7-64.7
                                       c-141.7-36.4-257.9,86.3-257.9,86.3,"
          stroke="#d1d1d1"
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
                fill="#f4bb01"
              />
              <path
                id="Path_333"
                data-name="Path 333"
                d="M157.5,150.972c2.7-9.9-6.786-21.1-21.182-25.025s-28.253.919-30.95,10.816,6.786,21.1,21.182,25.025,28.253-.919,30.95-10.816"
                transform="translate(-79.734 -94.686)"
                fill="#f4bb01"
              />
              <path
                id="Path_334"
                data-name="Path 334"
                d="M146.889,177.281s1.339-19.463,19.962-22.318"
                transform="translate(-111.637 -117.774)"
                fill="#f4bb01"
              />
              <path
                id="Path_335"
                data-name="Path 335"
                d="M234.862,212.262s-6.479-13.1,4.49-21.97"
                transform="translate(-177.054 -144.624)"
                fill="#f4bb01"
              />
              <path
                id="Path_336"
                data-name="Path 336"
                d="M190.35,61.76c-1.181,10.465,3.757,19.615,11.029,20.436s14.126-7,15.307-17.463S212.93,45.118,205.657,44.3s-14.126,7-15.307,17.463"
                transform="translate(-144.536 -33.621)"
                fill="#f4bb01"
              />
              <path
                id="Path_337"
                data-name="Path 337"
                d="M216.247,95.353c-10.069,3.089-16.491,11.265-14.344,18.262s12.049,10.165,22.118,7.076,16.491-11.265,14.344-18.262-12.049-10.165-22.118-7.076"
                transform="translate(-153.134 -71.57)"
                fill="#f4bb01"
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
      </svg>

      <div style={{ height: "10vh" }}></div>
      <div style={{ height: "400px", width: "100%" }}>
        <div style={{
            height: "10vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}><h1 className="comic-neue-bold text-xl">
            Recommended route to the destination.
          </h1></div>
        <div> </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m32!1m12!1m3!1d2439.003272176877!2d4.972094127397098!3d52.315943122008434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m17!3e2!4m5!1s0x47c60c6d8e06db4f%3A0xe09e6e0aa895e480!2sKraaiennest!3m2!1d52.316561899999996!2d4.9794852!4m3!3m2!1d52.3146561!2d4.9743043!4m5!1s0x47c60c74399f9dcd%3A0x42ce454cf5fe621a!2sKolfschotenstraat%20172%2C%201104%20PC%20Amsterdam%2C%20Netherlands!3m2!1d52.3166358!2d4.9696647!5e0!3m2!1sen!2snl!4v1726143683604!5m2!1sen!2snl"
          width="100%"
          height="100%"
          style={{ border: "0" }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
      </div>
    </div>
  );
}
