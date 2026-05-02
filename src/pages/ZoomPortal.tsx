import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const ZoomPortal = () => {
  const [searchParams] = useSearchParams();
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  console.log("ZoomPortal component initialized inside iframe");

  useEffect(() => {
    // 1. Force mobile-optimized viewport meta tag inside the portal
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      (meta as any).name = "viewport";
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
    );

    const meetingNumber = searchParams.get("mn");
    const password = searchParams.get("pwd");
    const userName = searchParams.get("un");
    const signature = searchParams.get("sig");
    const tk = searchParams.get("tk");
    const sdkKey = searchParams.get("key");

    if (!meetingNumber || !signature || !sdkKey) {
      console.error("Missing Zoom parameters");
      return;
    }

    let zoomClient: any = null;

    const loadScript = (src: string, id: string) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.crossOrigin = "anonymous";
        script.async = false;
        script.onload = () => resolve(true);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const startZoom = async () => {
      try {
        await loadScript(
          "https://unpkg.com/react@18/umd/react.production.min.js",
          "react-global",
        );
        await loadScript(
          "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
          "react-dom-global",
        );
        await loadScript(
          "https://source.zoom.us/3.13.2/zoom-meeting-embedded-3.13.2.min.js",
          "zoom-sdk-global",
        );

        const ZoomMtgEmbedded = (window as any).ZoomMtgEmbedded;
        if (!ZoomMtgEmbedded) return;

        zoomClient = ZoomMtgEmbedded.createClient();

        await zoomClient.init({
          zoomAppRoot: zoomContainerRef.current,
          language: "en-US",
          patchJsMedia: true,
          isFloating: false,
          customize: {
            video: {
              isResizable: true,
              viewSizes: {
                default: {
                  // width: window.innerWidth,
                  // height: window.innerHeight,
                },
              },
            },
          },
        });

        await zoomClient.join({
          sdkKey,
          signature,
          meetingNumber,
          password: password || "",
          userName: userName || "Guest",
          tk: tk || "",
        });

        // Setup dynamic resizing
        const resizeObserver = new ResizeObserver((entries) => {
          if (zoomClient) {
            const { width, height } = entries[0].contentRect;
            zoomClient.updateViewSizes({
              default: { width: Math.floor(width), height: Math.floor(height) },
            });
          }
        });

        if (zoomContainerRef.current) {
          resizeObserver.observe(zoomContainerRef.current);
        }

        // --- STYLE ENFORCEMENT LOOP ---
        // Brute force fix for "hidden parts" by constantly checking Zoom's internal positioning
        const styleLoop = setInterval(() => {
          const footer = document.getElementById("wc-footer");
          if (footer) {
            footer.style.bottom = "0";
            footer.style.position = "fixed";
          }
          const root = document.querySelector(".zmmtg-root") as HTMLElement;
          if (root) {
            root.style.height = window.innerHeight + "px";
          }
        }, 2000);

        return () => {
          clearInterval(styleLoop);
          resizeObserver.disconnect();
        };
      } catch (err) {
        console.error("Zoom Portal Error:", err);
      }
    };

    const timeout = setTimeout(startZoom, 500);
    return () => {
      clearTimeout(timeout);
      if (zoomClient) {
        try {
          zoomClient.leave();
        } catch (e) {
          console.log(e);
          
        }
      }
    };
  }, [searchParams]);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      <div
        ref={zoomContainerRef}
        id="zoom-portal-root"
        className="w-full h-full absolute inset-0"
      />

      {/* Global CSS for the portal to ensure full-bleed rendering */}
      <style>{`
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          height: 100dvh !important;
          height: -webkit-fill-available !important;
          overflow: hidden !important;
          background-color: black !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
        }
        
        #zoom-portal-root, .zmmtg-root, #zmmtg-canvas, .meeting-app, #wc-content {
          width: 100% !important;
          height: 100% !important;
          height: 100dvh !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          transform: none !important;
          display: flex !important;
          flex-direction: column !important;
        }

        /* Force the internal scrollable content to be visible */
        .full-screen-video, .speaker-view, .gallery-view {
           height: 100% !important;
        }

        /* Ensure the Zoom footer/controls are always at the bottom of the viewport */
        #wc-footer {
          bottom: 0 !important;
          position: absolute !important;
          width: 100% !important;
          z-index: 1000 !important;
          background: rgba(0,0,0,0.8) !important;
        }

        /* Fix for when Zoom injects its own styles later */
        #wc-header {
          display: none !important;
        }
        
        /* Attempt to reveal any "hidden" parts by ensuring no clipping on parent */
        .meeting-client-inner {
            height: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default ZoomPortal;
