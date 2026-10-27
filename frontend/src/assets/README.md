# Project Images

Place your project photos here, and they will be automatically optimized by Vite.

## How to use

1. **Drop your images** in this folder (`frontend/src/assets/`).
2. **Import them** in your React components:
   ```jsx
   import myPhoto from '@/assets/myPhoto.jpg'
   ```
3. **Use them** in your components:
   ```jsx
   <img src={myPhoto} alt="My photo" />
   ```

## Required images for Home page

| File | Usage | Recommended size |
|------|-------|-----------------|
| `hero.jpg` | Hero section (ScrollExpand) | 1920x1080px |
| `parallax-dark.jpg` | Dark parallax section | 1920x1080px |
| `parallax-light.jpg` | Light parallax section | 1920x1080px |

## Supported formats

- **JPG/JPEG** — Best for photos
- **PNG** — Best for images with transparency
- **WebP** — Best compression, modern browsers
- **SVG** — For icons and vector graphics

## Tips

- Keep images under 2MB for fast loading.
- Use descriptive filenames: `team-photo.jpg`, `product-hero.webp`.
- Vite automatically compresses and hashes images in production builds.
