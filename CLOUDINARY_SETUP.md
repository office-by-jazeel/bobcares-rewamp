# Cloudinary Integration with Local Fallback

This project uses Cloudinary for asset delivery with automatic fallback to local files when Cloudinary is not configured or assets fail to load.

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory and add your Cloudinary credentials:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Note:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

### 2. Cloudinary Account Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Upload your assets to Cloudinary with the following folder structure:
   - `bobcares/hero-bg` - Hero background
   - `bobcares/about-team` - Team photo
   - `bobcares/testimonials/sai` - Testimonial images
   - `bobcares/blogs/blog-1` - Blog images
   - `bobcares/portfolio/portfolio-1` - Portfolio images
   - etc.

### 3. How It Works

#### Automatic Fallback System

1. **If Cloudinary is configured:**
   - Components try to load images from Cloudinary first
   - If Cloudinary image fails to load, automatically falls back to local file
   - Uses optimized Cloudinary URLs with automatic format and quality

2. **If Cloudinary is NOT configured:**
   - All images load directly from local `/public` directory
   - No errors, seamless fallback

#### Components

- **`CloudinaryImage`** - Custom image component that handles Cloudinary/local fallback
- **`lib/cloudinary.ts`** - Utility functions for Cloudinary URL generation
- **`middleware.ts`** - Handles asset API routes
- **`app/api/assets/[...path]/route.ts`** - API route for asset delivery

### 4. Usage in Components

Replace `Image` from `next/image` with `CloudinaryImage`:

```tsx
import CloudinaryImage from "@/components/CloudinaryImage";

<CloudinaryImage
  src="/images/hero-bg.jpg"           // Local fallback path
  cloudinaryId="bobcares/hero-bg"    // Cloudinary public ID
  alt="Hero background"
  fill
  className="object-cover"
  priority
/>
```

### 5. Data Files

All JSON data files in `/data` now include optional `cloudinaryId` fields:

```json
{
  "backgroundImage": "/images/hero-bg.jpg",
  "backgroundImageCloudinaryId": "bobcares/hero-bg"
}
```

### 6. Benefits

- **Performance:** Cloudinary CDN delivers optimized images
- **Automatic optimization:** Format, quality, and size optimization
- **Reliability:** Automatic fallback ensures images always load
- **Flexibility:** Works with or without Cloudinary configuration
- **Development:** Use local files during development
- **Production:** Use Cloudinary CDN in production

### 7. Testing

1. **Without Cloudinary:** Remove or don't set environment variables - images load from local
2. **With Cloudinary:** Set environment variables - images load from Cloudinary with fallback

### 8. Video Support

For videos, use the same pattern:

```tsx
<CloudinaryImage
  src="/videos/demo.mp4"
  cloudinaryId="bobcares/videos/demo"
  alt="Demo video"
  // ... other props
/>
```

Cloudinary will automatically serve optimized video formats.

