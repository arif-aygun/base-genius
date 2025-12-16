const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 * @see {@link https://docs.base.org/mini-apps/core-concepts/manifest}
 */
export const minikitConfig = {
  
  // Paste accountAssociation object here
  accountAssociation: {
    header: "eyJmaWQiOjE2MDg5NTcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHg2NzMzZkYyOWU1OGE1Nzc5QmRkMmY3N0Y2RTRlYTRiMTFEZWI4ODE2In0",
    payload: "eyJkb21haW4iOiJiYXNlLWdlbml1cy52ZXJjZWwuYXBwIn0",
    signature: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABqICvQ5SN7Q8aTTGRI9cNzcrnw0MyDuAKsctN85meClMM5svSZpUgQx7smd0QbuHrZuONTnCXWuoB8MP5SRD8egAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl8ZgIay2xclZzG8RWZzuWvO8j9R0fus3XxDee9lRlVy8dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKeyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiM2xuYWNabWNDbnROcU1uUmdoNHh1VF9Ta2taYWNMTnJrTVd0NWZTUGZjYyIsIm9yaWdpbiI6Imh0dHBzOi8va2V5cy5jb2luYmFzZS5jb20iLCJjcm9zc09yaWdpbiI6ZmFsc2V9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  },


  miniapp: {
    version: "1",
    name: "BaseGenius",
    subtitle: "Stay Updated, Earn Rewards",
    description:
      "Answer 5 questions about this week's Farcaster & Base news and earn an NFT badge! New questions every week.",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/new_icon.png`,
    splashImageUrl: `${ROOT_URL}/new_splash.png`,
    splashBackgroundColor: "#0a1628",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["games", "education", "news", "nft"],
    heroImageUrl: `${ROOT_URL}/new_hero.png`,
    tagline: "Test Base knowledge, win NFT",
    ogTitle: "BaseGenius",
    ogDescription:
      "Answer 5 questions about Farcaster & Base news. Score 5/5 to claim an exclusive NFT badge!",
    ogImageUrl: `${ROOT_URL}/new_hero.png`,
  },
} as const;
