# Public Assets

This directory contains all static assets used in the application.

## Directory Structure

```
public/
├── images/
│   ├── products/     # Product images
│   ├── icons/        # UI icons and logos
│   └── backgrounds/  # Background images and patterns
```

## Image Guidelines

### Product Images

- All product images should be in JPG format
- Recommended size: 800x800px
- File naming: Use kebab-case (e.g., `product-name.jpg`)
- Optimize images for web use

### Icons

- Use SVG format for icons when possible
- Keep file sizes small
- Use consistent naming convention

### Backgrounds

- Use JPG for photos, PNG for patterns
- Optimize for web use
- Consider mobile responsiveness

## Usage

In your code, reference these assets using the `/` prefix:

```jsx
// Example usage
<img src="/images/products/product-name.jpg" alt="Product Name" />
<Image src="/images/icons/icon-name.svg" alt="Icon Name" />
```

## Maintenance

- Keep file names consistent and descriptive
- Remove unused assets
- Optimize new assets before adding
- Update this README when adding new asset types
