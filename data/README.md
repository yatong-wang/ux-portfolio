# Content Data Files

This directory contains JSON files that store all dynamic content for the portfolio website.

## Files

- **hero.json** - Hero section content (title, description, background image)
- **marquee.json** - Marquee/status section items
- **projects.json** - Portfolio projects with images, descriptions, and metadata
- **testimonials.json** - Testimonial cards with quotes and author information
- **site.json** - Site-wide content (navigation, footer, site metadata)

## How to Update Content

Simply edit the JSON files to update content. The changes will be automatically loaded when you refresh the page.

### Example: Adding a New Project

Edit `projects.json` and add a new object to the `projects` array:

```json
{
  "id": "new-project",
  "year": "2024",
  "category": "Product • UI/UX",
  "title": "New Project Name",
  "description": "Project description here...",
  "image": {
    "url": "https://example.com/image.jpg",
    "alt": "Image description"
  },
  "link": "/case-study-page"
}
```

### Example: Editing the Project Cover Images

Edit the `image` property for each array item in `projects.json`. 
Replace each project’s image.url with the corresponding local path. Leave image.alt as-is (or update alt text when you add the real images).

```json
  "image": {
    "url": "assets/images/projects/usda-enterprise-app-integration.jpg",
    "alt": "Modern fashion magazine cover redesign..."
  }
```


### Example: Adding a Testimonial

Edit `testimonials.json` and add a new object to the `testimonials` array:

```json
{
  "id": "person-name",
  "quote": "Testimonial quote with <strong>bold text</strong> if needed.",
  "note": "Optional note",
  "author": {
    "name": "Person Name",
    "role": "Their Role",
    "image": {
      "url": "https://example.com/photo.jpg",
      "alt": "Photo description"
    },
    "linkedin": "https://linkedin.com/..." // or null
  }
}
```

## Image URLs

You can use:
- External URLs (Google Photos, CDN, etc.)
- Relative paths to local images (e.g., `assets/images/project1.jpg`)
- Absolute URLs

## Notes

- HTML tags in quotes (like `<strong>`, `<b>`) are supported in testimonials
- All content is loaded dynamically via JavaScript
- Changes take effect immediately after refreshing the page
- No build step required - this is a static site solution

