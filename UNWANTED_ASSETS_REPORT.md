# Unwanted Assets Analysis Report

## Summary

**Total Unwanted Files: 61**  
**Total Unwanted Size: 60.08 MB (0.06 GB)**

---

## Categories of Unwanted Assets

### 1. Test Videos (Definitely Unused) - **54.44 MB**
These are test video files that are not referenced anywhere in the codebase:

- `public/videos/test1.mp4` (2.24 MB)
- `public/videos/test2.mp4` (34.57 MB)
- `public/videos/test3.mp4` (2.24 MB)
- `public/videos/test4.mp4` (15.38 MB)

**Recommendation:** Delete these files immediately as they serve no purpose in production.

---

### 2. Unused Icon Files - **0.06 MB**
These icon files have "-icon" suffix variants that are not being used (the non-suffixed versions are used instead):

- `public/icons/email-icon.svg`
- `public/icons/facebook-icon.svg`
- `public/icons/instagram-icon.svg`
- `public/icons/linkedin-icon.svg`
- `public/icons/twitter-icon.svg`
- `public/icons/youtube-icon.svg`
- `public/icons/menu-icon.svg`
- `public/icons/play-icon.svg`
- `public/icons/bob.png` (0.03 MB)
- `public/icons/bob.svg` (0.02 MB)
- `public/icons/get.png`

**Recommendation:** Delete if not needed for future use.

---

### 3. Unused SVG Files - **0.00 MB**
Default Next.js files and other unused SVG assets:

- `public/file.svg`
- `public/globe.svg`
- `public/window.svg`
- `public/next.svg` (default Next.js file)
- `public/vercel.svg` (default Vercel file)

**Recommendation:** Delete `next.svg` and `vercel.svg` if not using them. Keep others only if needed for future features.

---

### 4. Duplicate Client Logos (Old `clients/` folder) - **0.44 MB**
The `clients_new/` folder is actively used in the codebase, making the old `clients/` folder redundant. However, note that some files in `clients/` are still referenced (like `appraise.png`, `matthew-owen.png`, `oliver-marketing.png`, `paykini.webp`). The following are NOT referenced:

- `public/images/clients/besttech-computing.png`
- `public/images/clients/boothbook.webp`
- `public/images/clients/chrysalis-digital.png`
- `public/images/clients/creatingdig.svg`
- `public/images/clients/eggsa.jpg`
- `public/images/clients/freshpage-media.png`
- `public/images/clients/gullos-hosting.png`
- `public/images/clients/hlscc.png`
- `public/images/clients/horecavoordeel.svg`
- `public/images/clients/hostirian.png`
- `public/images/clients/imc-digital.png`
- `public/images/clients/imltd.png`
- `public/images/clients/lucanet.png`
- `public/images/clients/pc-patrol.webp`
- `public/images/clients/prolego.png`
- `public/images/clients/rand4dollar.png`
- `public/images/clients/reformrx.png`
- `public/images/clients/riscosity.svg`
- `public/images/clients/smilii.png`
- `public/images/clients/super-domains.png`
- `public/images/clients/toucan-graphics.png`
- `public/images/clients/tuyo-tienda.png`
- `public/images/clients/zut.svg`

**Recommendation:** Delete these duplicate files. Keep only the files that are still referenced (`appraise.png`, `matthew-owen.png`, `oliver-marketing.png`, `paykini.webp`, and the `demo/` folder).

---

### 5. Unused Client Logos (in `clients_new/` but not referenced) - **0.37 MB**
These files exist in the `clients_new/` folder but are not referenced in `data/mapPins.json`:

- `public/images/clients_new/EasyPay.png` (0.02 MB)
- `public/images/clients_new/HAWK.png` (0.12 MB)
- `public/images/clients_new/MNSI TELECOM.png` (0.08 MB)
- `public/images/clients_new/VP Startup.png` (0.15 MB)

**Recommendation:** Delete if these clients are no longer active, or add them to `mapPins.json` if they should be displayed.

---

### 6. Unused Images (Referenced via Cloudinary only) - **4.77 MB**
These images are referenced via Cloudinary IDs but have local fallback files that may not be needed if Cloudinary is always available:

- `public/images/about-team.jpg` (0.13 MB) - Cloudinary ID: `bobcares/about-team`
- `public/images/portfolio-1.jpg` (1.27 MB) - Cloudinary ID: `bobcares/portfolio/portfolio-1`
- `public/images/collaborate-bg.jpg` (1.26 MB) - Not directly referenced
- `public/images/services-cta-bg.jpg` (0.02 MB) - Not directly referenced
- `public/images/testimonial-sai.jpg` (0.02 MB) - Not directly referenced
- `public/images/testimonial-shamil.jpg` (0.08 MB) - Not directly referenced
- `public/images/videoframe_0.png` (1.39 MB) - Not directly referenced
- `public/images/world-map.png` (0.52 MB) - `world-map.svg` is used instead
- `public/images/bobcares.png` (0.02 MB) - `bobcares.svg` is used instead
- `public/images/cert-badge.jpg` - Not directly referenced
- `public/images/cert-google-icon.jpg` - Not directly referenced
- `public/images/cert-logo-1.png` - Not directly referenced
- `public/images/cert-logo-2.png` - Not directly referenced
- `public/images/certification-google.jpg` - Not directly referenced

**Recommendation:** 
- Keep Cloudinary fallback images if you want redundancy
- Delete `world-map.png` (use `world-map.svg` instead)
- Delete `bobcares.png` (use `bobcares.svg` instead)
- Delete other unused images if not needed

---

## Additional Notes

### Large File Warning
`public/videos/20_SEC_FINAL.mov` is **95.27 MB** and IS referenced in the code (`data/hero.json`). Consider:
- Optimizing the video file
- Moving it to Cloudinary/CDN
- Converting to a more efficient format (e.g., WebM)

### Files That ARE Used (Keep These)
- All files in `public/images/clients/demo/` (1.png, 2.png, 3.png, 4.png) - Used in `mapPins.json`
- `public/images/clients/appraise.png` - Used in `mapPins.json`
- `public/images/clients/matthew-owen.png` - Used in `mapPins.json`
- `public/images/clients/oliver-marketing.png` - Used in `mapPins.json`
- `public/images/clients/paykini.webp` - Used in `mapPins.json`
- All files in `public/images/clients_new/` except the 4 listed above - Used in `mapPins.json`
- All certificate files - Used in `data/certifications.json`
- All service icons - Used in `data/services.json` and `data/navigation.json`
- All testimonial images - Used in `data/testimonials.json`
- All portfolio images (port1.png - port9.png) - Used in `data/portfolio.json`

---

## Quick Action Items

1. **Immediate deletion (safe):**
   - All 4 test video files (54.44 MB)
   - `next.svg` and `vercel.svg` (if not needed)
   - Unused icon files with "-icon" suffix

2. **Review before deletion:**
   - Duplicate client logos in `clients/` folder (keep referenced ones)
   - Unused client logos in `clients_new/` folder
   - Cloudinary fallback images (if Cloudinary is always available)

3. **Optimization:**
   - Consider optimizing `20_SEC_FINAL.mov` (95.27 MB)
   - Consider optimizing `cta.mp4` (30 MB)

---

## Total Space Savings Potential

**Minimum (safe deletions):** ~54.5 MB  
**Maximum (all unused files):** ~60 MB  
**With optimization:** Additional ~125 MB from large video files

