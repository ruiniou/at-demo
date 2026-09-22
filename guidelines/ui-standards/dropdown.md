# Dropdown foundations

## Components
- Popover: controlled floating surface, shared positioning/flip/clamp, outside click, Escape, focus restoration. Default surface uses an 8px radius and 4px padding; callers inherit this shape rather than adding per-page radius overrides.
- OptionLabel: selectable row; uses a 4px radius and retains the existing API and 32px single-line layout. Optional description has a 48px minimum and may wrap. No new row density variants.
- MenuItem: action button with menuitem semantics, optional icon/shortcut, danger state; its existing 4px radius is retained.
- CheckboxIndicator: visual-only checked/mixed indicator. Use inside option buttons; never nest the interactive Checkbox button inside another button.
- Checkbox: standalone interaction using the same indicator; supports aria-label/aria-labelledby.
- DropdownGroupLabel / DropdownSeparator / DropdownEmpty: reusable list anatomy.

## Appearance
- Existing avatar hierarchy remains unchanged: page 24px; modal/menu 20px.
- Disabled text, monochrome icons and unchecked checkbox outlines use graphite-40 (#B2B4B4), without reducing whole-row opacity. Disabled checked/mixed indicators use graphite-40 fill and outline with a white (`--color-white`) check/minus mark; disabled unchecked indicators retain a white interior with no mark.
- Icons supplied to row slots must use currentColor or a currentColor CSS mask; external SVG images with baked-in colors must be converted to masks. Person avatars retain their identity palette.
- Disabled takes precedence over selected and danger. No hover fill on disabled rows.
- Danger: status-error text/icon, existing shallow status-error-bg hover/pressed fill. Always retain explicit action text.
- Normal option appearance, group labels and member content are retained. Do not add emails or descriptions simply because the component supports them.
- Multi-select rows remain on the default surface when checked. Selection is communicated by CheckboxIndicator only; apply the row background on hover, not as a persistent selected fill.

## Behavior and semantics
- MenuItem executes an action; OptionLabel selects a value. Do not give selectable rows menuitem semantics automatically.
- Popover menu mode supports arrows/Home/End; Escape closes the popup before its parent Modal and restores focus. Outside click preserves the clicked target's focus.
- The current Dropdown uses a labeled dialog of native selectable buttons. Full combobox/listbox behavior is a separate future migration, not implied by this foundation.
- Portal surfaces follow the anchor on scroll/resize, flip when needed, and constrain height to the viewport.
- Adoption in this pass: Dropdown uses Popover; AccountMenu uses Popover/MenuItem; dropdowns share OptionLabel/CheckboxIndicator; Event Team uses shared group/empty components and disabled colors.
- Other bespoke floating panels remain in place for incremental migration. Preserve their business behavior and layout during adoption.

## Radius rules

- Action menus and selection dropdowns share an 8px outer surface and 4px interactive option corners. Component defaults own the shape; do not introduce different radius scales for menu semantics versus selection semantics. Global radius tokens are unchanged.
- Compact menu lists use 4px surface padding, approximately matching outer radius = inner radius + inset. Include borders in visual checks. Composite filter panels, table grids and large modal content retain their own spacing; do not mechanically apply this equation across headers or large whitespace.
- `SearchBar` owns its shape through `variant="default" | "embedded"`, independently of `size="default" | "compact"`. Use the variant rather than overriding radius through a caller's `className`.
- The default variant retains the existing 8px outer / 6px inner shape. The embedded variant uses 4px outer / 2px inner corners with the existing 2px inset. Search heights remain 36px by default and 32px for compact.
- These values reference existing theme tokens: `rounded-md` / `rounded-sm` resolve to 8px / 6px in the current theme; `--radius-xs` is 2px. Use `rounded-[calc(var(--radius-xs)*2)]` for changed 4px corners and `rounded-xs` for the embedded search interior. Do not confuse these runtime names with the differently named primitives in `guidelines/Style/radius.json`.
- Use embedded search inside dropdowns and tightly grouped form/toolbars: `CreatableDropdown` (both Project Code and Study Code), `UploadCard`, the active inline variable dropdown, New Study owner search and Event Team assignment search. Existing native people/code searches already using 4px remain in place without a component rewrite.
- Independent page/tree searches and the Download modal's standalone search row retain the default 8px shape. Being inside a Modal alone is not a reason to use embedded search; consider functional grouping, height and visual importance of neighboring controls.
- The rollout covers shared `Popover`/`OptionLabel`, custom selection/filter menus, Group Code and zoom selectors, session and mention options, tree assignee options, and component/event action menus. Existing compliant 8px surfaces and 4px options are retained; bespoke implementations keep their existing business behavior rather than being migrated to Popover.
- Ordinary Input and Selector trigger defaults remain 4px, separate from their 8px dropdown surfaces. Existing field exceptions, Modal surfaces, Tooltip, cards, badges, and unused legacy search implementations are outside this rollout. Do not expand this work to them without a separate decision.
- Approved page-table follow-up: the main table frames on Projects & Studies and Events use an 8px radius (`rounded-md`), matching their independent primary searches. Retain the existing outer clipping and inner scrolling so header/row backgrounds follow the frame; do not round individual cells or change embedded controls. Other table frames and table internals remain outside this change.
