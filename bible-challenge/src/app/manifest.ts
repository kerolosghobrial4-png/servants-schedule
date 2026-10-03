import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bible Challenge",
    short_name: "Bible Challenge",
    description: "Daily Bible study competition",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0e0f",
    theme_color: "#0e0e0f",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
