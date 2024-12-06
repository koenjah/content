# Content Scribe Dashboard Style Guide

## Colors

### Main Colors
- **Background** (`#171717`): Main application background
- **Card** (`#262626`): Used for card backgrounds and elevated surfaces
- **Accent/Primary** (`#ED7C2F`): Orange accent color used for:
  - Primary buttons
  - Focus states
  - Interactive elements
  - Highlighting active states

### Text Colors
- **Foreground**: Main text color (white in dark theme)
- **Muted Foreground**: Secondary text, used for:
  - Descriptions
  - Helper text
  - Less important information

### UI Element Colors
- **Border** (`hsl(var(--border))`): Used for dividing elements and containers
- **Input** (`hsl(var(--input))`): Form input backgrounds
- **Ring** (`hsl(var(--ring))`): Focus rings and outlines
- **Secondary**: Used for secondary UI elements
- **Destructive**: Used for error states and delete actions

## Typography

### Font Family
- Primary Font: `'Inter'`, with fallback to `sans-serif`
- Font Weights:
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700

### Text Sizes
- Extra Small (`text-xs`): Used for badges and small labels
- Small (`text-sm`): Used for secondary text and descriptions
- Base (`text-base`): Default text size
- Large (`text-lg`): Used for section headers
- Extra Large (`text-xl`): Used for main headings
- 2XL (`text-2xl`): Used for card titles and major headings

## Border Radius
All border radius values are set to `4px` for consistency:
- Small (`rounded-sm`): 4px
- Medium (`rounded-md`): 4px
- Large (`rounded-lg`): 4px
- Full (`rounded-full`): Used for circular elements like badges

## Spacing
- Container Padding: `2rem`
- Card Padding: `1.5rem` (`p-6`)
- Input Padding: `0.5rem 1rem` (`px-4 py-2`)
- Gap between elements: `0.5rem` (`gap-2`)

## Interactive Elements

### Buttons
```css
.btn-primary {
  background: #ED7C2F;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: opacity 0.2s;
}
```

### Input Fields
```css
.input-field {
  background: #262626;
  border: 1px solid #404040;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  width: 100%;
}
```

### Cards
```css
.card {
  background: #262626;
  border-radius: 4px;
  border: 1px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

## Hover States
- Cards: Slight opacity change (`hover:bg-opacity-80`)
- Buttons: Opacity reduction (`hover:bg-opacity-90`)
- Interactive elements: Background color change (`hover:bg-accent`)

## Focus States
- Ring outline with offset
- Color changes to accent color
- Visible outline for accessibility

## Transitions
- All transitions use a duration of 200ms
- Smooth easing for natural feeling
- Applied to:
  - Hover states
  - Focus states
  - Interactive elements
  - Animations

## Icons
- Default size: 16x16 (`w-4 h-4`)
- Large size: 20x20 (`w-5 h-5`)
- Used from Lucide React library
- Common icons:
  - Check
  - ChevronDown
  - ChevronRight
  - Circle
  - X (close)

## Shadows
- Card shadow: `shadow-sm`
- Elevated elements: `shadow-md`
- Dropdowns and popovers: `shadow-lg`

## Z-Index Layers
- Base content: 0
- Dropdowns: 50
- Modals/Dialogs: 100
- Tooltips: 1000

## Animations
- Fade in/out
- Zoom in/out (95% to 100%)
- Slide animations for drawers and modals
- Duration: 300-500ms

## Responsive Breakpoints
- Default: Mobile first
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1400px

## Component-Specific Styles

### Navigation
- Active state: Semi-transparent accent background
- Hover: Lighter background
- Padding: `0.5rem 1rem`

### Tables
- Hover state: Subtle background change
- Border bottom for rows
- Aligned text: Left for content, right for numbers

### Forms
- Label: Semibold weight
- Required indicator: Red asterisk
- Error states: Red border and text
- Helper text: Muted color, smaller size

### Modals/Sheets
- Overlay: Black with 80% opacity
- Content: Card background
- Close button: Top right corner
- Animation: Slide and fade


Layout
Spacing:

Outer Margins: 40px padding from the screen edge.
Section Padding: Each section (Klant Mappen and Recente Artikelen) has 20px padding internally.
Element Spacing:
Between folders or articles: 10px.
Between sections: 20px.
Positioning:

Content Dashboard Title:
Centered horizontally at the top of the screen with a margin of 30px below.
Sections (Klant Mappen and Recente Artikelen):
Positioned side-by-side.
Left Section: "Klant Mappen" aligned flush left.
Right Section: "Recente Artikelen" aligned flush right.
Section Widths:

Both sections are equally spaced, taking up 50% of the total width with a 20px gap between them.
Icons
Folder Icons:

Design: Simplistic orange folder icon, using a solid fill.
Placement: Positioned to the left of the folder name, vertically centered.
Size: 24x24px.
Color: Hex #F26D13.
Article Icons:

No additional icons visible for articles, aside from the word count.
Action Button
Button Text: "+ Nieuw Artikel"

Font Size: 16px.
Font Weight: Bold.
Text Color: White (#FFFFFF).
Button Background:

Color: Hex #F26D13.
Shape: Rounded rectangle with 8px corner radius.
Position: Top-right corner of the screen, directly aligned with the "Recente Artikelen" title.
Hover State:

Background Color: Slightly darker orange (#D65B10).
Cursor: Pointer.
Section Details
Klant Mappen
Description: Contains clickable folders representing client names.
Folder Design:
Background: Transparent.
Font: Gray text (#B0B0B0) on hover turns white (#FFFFFF).
Icon: Folder icon aligned to the left of each name, spaced by 8px.
Interactivity:
Entire row acts as a clickable area.
Recente Artikelen
Description: Displays a list of recent articles, including metadata like word count and date.
Item Design:
Title: White text (#FFFFFF), bolded.
Metadata:
Color: Orange (#F26D13).
Alignment: Aligned to the right of each article title.
Spacing: 5px from the title.
Hover State: Text becomes underlined.


This style guide should be used as a reference for maintaining consistent design throughout the application. All components should follow these guidelines to ensure a cohesive user experience.