# Dropdown foundations

## Components
- Popover: controlled floating surface, shared positioning/flip/clamp, outside click, Escape, focus restoration. Default surface preserves 4px radius and padding; callers may retain existing surface styles.
- OptionLabel: selectable row; retains existing API and 32px single-line layout. Optional description has a 48px minimum and may wrap. No new row density variants.
- MenuItem: action button with menuitem semantics, optional icon/shortcut, danger state.
- CheckboxIndicator: visual-only checked/mixed indicator. Use inside option buttons; never nest the interactive Checkbox button inside another button.
- Checkbox: standalone interaction using the same indicator; supports aria-label/aria-labelledby.
- DropdownGroupLabel / DropdownSeparator / DropdownEmpty: reusable list anatomy.

## Appearance
- Existing avatar hierarchy remains unchanged: page 24px; modal/menu 20px.
- Disabled text, monochrome icons, outline checkbox and check indicators use graphite-40 (#B2B4B4), without reducing whole-row opacity. Disabled checked/mixed indicators use a white interior and gray outline/mark.
- Icons supplied to row slots must use currentColor or a currentColor CSS mask; external SVG images with baked-in colors must be converted to masks. Person avatars retain their identity palette.
- Disabled takes precedence over selected and danger. No hover fill on disabled rows.
- Danger: status-error text/icon, existing shallow status-error-bg hover/pressed fill. Always retain explicit action text.
- Normal option appearance, group labels and member content are retained. Do not add emails or descriptions simply because the component supports them.

## Behavior and semantics
- MenuItem executes an action; OptionLabel selects a value. Do not give selectable rows menuitem semantics automatically.
- Popover menu mode supports arrows/Home/End; Escape closes the popup before its parent Modal and restores focus. Outside click preserves the clicked target's focus.
- The current Dropdown uses a labeled dialog of native selectable buttons. Full combobox/listbox behavior is a separate future migration, not implied by this foundation.
- Portal surfaces follow the anchor on scroll/resize, flip when needed, and constrain height to the viewport.
- Adoption in this pass: Dropdown uses Popover; AccountMenu uses Popover/MenuItem; dropdowns share OptionLabel/CheckboxIndicator; Event Team uses shared group/empty components and disabled colors.
- Other bespoke floating panels remain in place for incremental migration. Preserve their business behavior and layout during adoption.
