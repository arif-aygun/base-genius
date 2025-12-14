# NFT Metadata Specification

This document outlines the metadata structure for BaseGenius weekly badge NFTs.

---

## Overview

Each weekly badge has unique metadata following the OpenSea metadata standard. Metadata URIs are constructed as:

```
{baseURI}/week-{weekNumber}.json
```

**Example**: `https://metadata.basegenius.app/week-50.json`

---

## Metadata Structure

### Standard Fields

```json
{
  "name": "BaseGenius Week {N} Badge",
  "description": "Earned by achieving a perfect score (5/5) on the BaseGenius Week {N} quiz about Base and Farcaster ecosystem news.",
  "image": "https://your-cdn.com/images/week-{N}-badge.png",
  "external_url": "https://basegenius.app",
  "attributes": [...],
  "animation_url": "https://your-cdn.com/animations/week-{N}-badge.mp4",
  "background_color": "0052FF"
}
```

### Field Descriptions

| Field | Required | Description |
|-------|----------|-------------|
| `name` | ✅ Yes | Display name of the NFT |
| `description` | ✅ Yes | Detailed description of achievement |
| `image` | ✅ Yes | URL to badge image (PNG/JPG/SVG) |
| `external_url` | ⚠️ Optional | Link to your app |
| `attributes` | ⚠️ Optional | Trait metadata (recommended) |
| `animation_url` | ⚠️ Optional | URL to animation/video |
| `background_color` | ⚠️ Optional | Hex color (no #) |

---

## Attributes (Traits)

Recommended traits for each weekly badge:

```json
"attributes": [
  {
    "trait_type": "Week Number",
    "value": 50
  },
  {
    "trait_type": "Year",
    "value": 2024
  },
  {
    "trait_type": "Achievement",
    "value": "Perfect Score"
  },
  {
    "trait_type": "Quiz Type",
    "value": "Base Ecosystem News"
  },
  {
    "trait_type": "Rarity",
    "value": "Weekly Limited"
  }
]
```

### Custom Traits (Optional)

You can add additional traits:

```json
{
  "trait_type": "Theme",
  "value": "DeFi Week"
},
{
  "trait_type": "Difficulty",
  "value": "Hard"
},
{
  "display_type": "date",
  "trait_type": "Quiz Date",
  "value": 1702526400
}
```

---

## Hosting Options

### Option 1: IPFS (Recommended for Production)

**Pros**: Decentralized, permanent, censorship-resistant

**Setup**:
1. Use [Pinata](https://pinata.cloud) or [NFT.Storage](https://nft.storage)
2. Upload images first, get CIDs
3. Create metadata JSON with `ipfs://` image URLs
4. Upload metadata JSONs
5. Set baseURI to `ipfs://{yourCID}/`

**Example**:
```
baseURI: ipfs://QmYourCID/
Token URI: ipfs://QmYourCID/week-50.json
Image: ipfs://QmImageCID/week-50.png
```

### Option 2: Arweave

**Pros**: Permanent storage, one-time payment

**Setup**:
1. Use [Bundlr](https://bundlr.network) or [Ardrive](https://ardrive.io)
2. Upload assets and metadata
3. Set baseURI to `https://arweave.net/{id}/`

### Option 3: Centralized CDN (Easiest for Testing)

**Pros**: Fast, easy to update, cheap

**Cons**: Not decentralized, can be changed/deleted

**Setup**:
1. Use Vercel public folder or separate CDN
2. Upload files to `/public/metadata/`
3. Set baseURI to `https://yourdomain.com/metadata/`

**For testing**, you can use your Vercel deployment:
```
baseURI: https://your-app.vercel.app/metadata/
```

---

## Image Specifications

### Recommended Specs

- **Format**: PNG with transparency (or JPG/SVG)
- **Dimensions**: 1000x1000px (1:1 ratio)
- **File Size**: < 1MB for fast loading
- **Resolution**: 72 DPI minimum

### Design Guidelines

- **Consistent branding** across all weeks
- **Week number** prominently displayed
- **Base/Farcaster** visual elements
- **Premium aesthetic** (gradients, animations)

### Animation (Optional)

- **Format**: MP4, GIF, or GLB (3D)
- **Dimensions**: 1000x1000px
- **Duration**: 3-10 seconds (loop)
- **File Size**: < 5MB

---

## Example Metadata Files

### Week 50 Example

```json
{
  "name": "BaseGenius Week 50 Badge",
  "description": "Earned by achieving a perfect score (5/5) on the BaseGenius Week 50 quiz about Base and Farcaster ecosystem news. This badge represents mastery of the latest developments in the Base ecosystem.",
  "image": "https://basegenius.app/metadata/images/week-50.png",
  "external_url": "https://basegenius.app",
  "attributes": [
    {
      "trait_type": "Week Number",
      "value": 50
    },
    {
      "trait_type": "Year",
      "value": 2024
    },
    {
      "trait_type": "Achievement",
      "value": "Perfect Score"
    },
    {
      "trait_type": "Quiz Type",
      "value": "Base Ecosystem News"
    }
  ],
  "background_color": "0052FF"
}
```

### Week 51 Example

```json
{
  "name": "BaseGenius Week 51 Badge",
  "description": "Earned by achieving a perfect score (5/5) on the BaseGenius Week 51 quiz about Base and Farcaster ecosystem news.",
  "image": "https://basegenius.app/metadata/images/week-51.png",
  "external_url": "https://basegenius.app",
  "attributes": [
    {
      "trait_type": "Week Number",
      "value": 51
    },
    {
      "trait_type": "Year",
      "value": 2024
    },
    {
      "trait_type": "Achievement",
      "value": "Perfect Score"
    }
  ],
  "background_color": "7B3FF2"
}
```

---

## Metadata Generation

### Manual Creation

For weekly updates, manually create JSON files:

```bash
public/metadata/
├── week-50.json
├── week-51.json
├── week-52.json
└── images/
    ├── week-50.png
    ├── week-51.png
    └── week-52.png
```

### Automated Generation (Future Enhancement)

Create a script to generate metadata:

```typescript
// scripts/generate-metadata.ts
const weekNumber = 50;
const metadata = {
  name: `BaseGenius Week ${weekNumber} Badge`,
  description: `Earned by achieving a perfect score...`,
  image: `https://basegenius.app/metadata/images/week-${weekNumber}.png`,
  attributes: [
    { trait_type: "Week Number", value: weekNumber },
    // ...
  ]
};

fs.writeFileSync(
  `public/metadata/week-${weekNumber}.json`,
  JSON.stringify(metadata, null, 2)
);
```

---

## Testing Metadata

### Local Testing

1. Start your dev server: `npm run dev`
2. Access metadata: `http://localhost:3000/metadata/week-50.json`
3. Verify JSON is valid and accessible

### OpenSea Testnet

1. Deploy contract to Base Sepolia
2. Mint a test NFT
3. View on [OpenSea Testnet](https://testnets.opensea.io)
4. Check if metadata displays correctly
5. May take 5-10 minutes to refresh

### Force Metadata Refresh

On OpenSea, click **Refresh metadata** button to force update.

---

## Production Checklist

Before deploying to mainnet:

- [ ] All metadata JSON files created for current week
- [ ] Images uploaded and accessible
- [ ] Metadata URLs tested and working
- [ ] OpenSea testnet preview looks correct
- [ ] baseURI set correctly in contract
- [ ] Backup of all metadata files

---

## Weekly Update Process

1. **Create new images** for the week
2. **Generate metadata JSON** with new week number
3. **Upload to hosting** (IPFS/CDN)
4. **Test accessibility** of new files
5. Contract automatically uses correct URI based on week number

---

## Need Help?

- [OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [NFT.Storage Guide](https://nft.storage/docs/)
