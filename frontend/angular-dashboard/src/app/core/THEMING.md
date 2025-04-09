# Angular Material Theming Guide

This document provides guidance on how to properly use Angular Material's color theming system in the IoT Monitor application.

## Overview

The theming system has been updated to follow Angular Material's best practices for color theming as described in the official documentation:
- https://material.angular.io/guide/theming#color
- https://material.angular.io/guide/theming#color-map

## Key Changes

1. Implemented proper color maps for primary, accent, and warn palettes
2. Created SCSS functions to access theme colors
3. Maintained backward compatibility with existing CSS variables
4. Added documentation and examples

## How to Use the Theming System

### Option 1: Using SCSS Functions (Recommended)

Import the theme.scss file and use the provided functions:

```scss
@use '../../core/theme.scss' as theme;

.my-component {
  background-color: theme.primary(500);
  color: theme.primary-contrast(500);
  
  &:hover {
    background-color: theme.primary(700);
    color: theme.primary-contrast(700);
  }
}
```

Available functions:
- `primary($hue)` - Get a color from the primary palette
- `primary-contrast($hue)` - Get a contrast color for the primary palette
- `accent($hue)` - Get a color from the accent palette
- `accent-contrast($hue)` - Get a contrast color for the accent palette
- `warn($hue)` - Get a color from the warn palette
- `warn-contrast($hue)` - Get a contrast color for the warn palette

### Option 2: Using CSS Variables (For Backward Compatibility)

```scss
.my-component {
  background-color: var(--primary-color);
  color: var(--primary-contrast);
  
  &:hover {
    background-color: var(--primary-dark);
  }
}
```

Available CSS variables:
- `--primary-color` - Primary color (500)
- `--primary-color-rgb` - Primary color as RGB values
- `--primary-light` - Light primary color (300)
- `--primary-dark` - Dark primary color (700)
- `--primary-contrast` - Contrast color for primary

Similar variables exist for accent and warn colors.

### Option 3: Creating Custom Component Themes

For more complex components, you can create a custom theme mixin:

```scss
@use '@angular/material' as mat;
@use 'sass:map';

@mixin my-component-theme($theme) {
  // Extract the color configuration
  $color-config: mat.get-color-config($theme);
  $primary-palette: map.get($color-config, 'primary');
  $accent-palette: map.get($color-config, 'accent');
  $warn-palette: map.get($color-config, 'warn');
  $is-dark: map.get($color-config, 'is-dark');
  
  .my-component {
    background-color: mat.get-color-from-palette($primary-palette, 50);
    color: mat.get-color-from-palette($primary-palette, 900);
    
    .my-component-header {
      background-color: mat.get-color-from-palette($primary-palette, 500);
      color: mat.get-color-from-palette($primary-palette, 500-contrast);
    }
    
    // Support for dark theme
    @if $is-dark {
      background-color: mat.get-color-from-palette($primary-palette, 800);
      color: mat.get-color-from-palette($primary-palette, 800-contrast);
    }
  }
}
```

Then in your component's main SCSS file:

```scss
@use '../../core/theme.scss' as theme;
@use './my-component-theme' as my-theme;

@include my-theme.my-component-theme(theme.$iot-light-theme);

// Optional: Support for dark theme
@media (prefers-color-scheme: dark) {
  @include my-theme.my-component-theme(theme.$iot-dark-theme);
}
```

## Examples

See the `_theme-example.scss` file for more detailed examples of how to use the theming system.

## Migration Guide

1. For new components, use Option 1 (SCSS Functions) or Option 3 (Custom Component Themes)
2. For existing components, you can continue using Option 2 (CSS Variables) or gradually migrate to Option 1

## Color Palette Reference

The application uses the following color palettes:

- Primary: Blue palette (700 default, 400 lighter, 900 darker)
- Accent: Pink palette (A200 default, A100 lighter, A400 darker)
- Warn: Red palette

Available hues for each palette:
- Standard hues: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
- Accent hues (for accent palette only): A100, A200, A400, A700
- Contrast hues: Add "-contrast" to any hue (e.g., 500-contrast)