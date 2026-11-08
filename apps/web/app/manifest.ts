import type { MetadataRoute } from "next";

// Name, icons and colours for "Add to home screen" and the browser chrome (the night ground, tokens.css).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Whiteflow",
    short_name: "Whiteflow",
    start_url: "/",
    display: "browser",
    background_color: "#12131c",
    theme_color: "#12131c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
