# AZ Color Guidelines

## Core Principles

### DO

- Use AZ brand palette as the primary source of all UI and data visualization colors.
- Use accent and interaction colors only for important actions, highlights, or key data points.
- Use contrasting hues for diverging datasets.
- Keep UI color usage minimal and intentional.
- Pair color with labels, icons, shapes, or text states for accessibility.
- Use lighter palette intensities (`20–40`) for backgrounds and surfaces.
- Use stronger palette intensities (`80–100`) for actions, emphasis, and charts.

---

### DON'T

- Don’t use more than 6 primary colors in a single visualization or interface.
- Don’t hardcode colors directly inside components or typography styles.
- Don’t combine inaccessible color pairs such as:
    - green + red
    - blue + purple
    - green + grey
    - blue + grey
- Don’t place text on complex gradients or noisy backgrounds without sufficient contrast.
- Don’t use highly saturated colors for large surface areas.
- Don’t use accent colors equally everywhere; emphasis loses meaning.

---

# Accessibility Rules

- Minimum text contrast ratio: `4.5:1` for normal text.
- Large text may use `3:1` minimum contrast ratio.
- Avoid color-only indicators for alerts, charts, or status.
- All charts should remain understandable in grayscale or colorblind simulations.
- Use direct labels and legends inside charts whenever possible.