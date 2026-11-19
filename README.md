# Portfolio

A one-page personal portfolio built from the design in `Portfolio-Design-9.pdf` (page 1 is the desktop layout, page 2 is mobile).

## Tech Stack

- **HTML5** with semantic markup
- **CSS3** with custom properties (design tokens), Grid/Flexbox and responsive breakpoints
- **Vanilla JavaScript** for the mobile menu, scroll-reveal, skill-bar animation and active nav link
- **Inter** font from Google Fonts
- No build step

## Project Structure

```
portfolio/
├── index.html              # Page markup (all sections)
├── css/styles.css          # Design tokens + all styles
├── js/main.js              # Menu, reveal animations, nav highlight
├── assets/                 # Add your files here (see "Customize")
│   ├── cv.pdf
│   └── images/
├── Portfolio-Design-9.pdf  # Source design
└── README.md
```

## Design Breakdown

| Section | Desktop | Mobile |
|---|---|---|
| **Navbar** | "YN" logo + name; Experience / Projects / Skills links; teal **Download CV** button. Sticky. | Logo + name, hamburger menu |
| **Hero card** | Round photo on the left; "Open to full-time roles" badge, name (navy), job title (slate), 2–3 line intro, location · email · LinkedIn | Centered and stacked; **Download CV** + **Contact** buttons replace the contact line |
| **Experience** | White card with a timeline (teal dots, connecting line), 3 roles: title, company · dates (teal), one-line result | Full-width card |
| **Skills** | Sidebar card with 5 labelled progress bars (90 / 85 / 80 / 70 / 65%) | Full-width card |
| **Education** | Navy sidebar card: degree, university · year, certification · year | Full-width card |
| **Featured projects** | 3-column grid of cards: image, title, description, "View details →" | Single column |
| **Contact CTA** | Teal banner: "Let's work together", reply-time note, white email button | Stacked; full-width email button |
| **Footer** | Centered "© 2026 [Your Name]" | Same |

### Design Tokens

| Token | Value | Used for |
|---|---|---|
| `--navy` | `#10295c` | Headings, name, education card |
| `--teal` | `#0f7a76` | Primary buttons, logo, timeline dots, skill bars, CTA |
| `--slate` | `#475569` | Job title, body text |
| `--bg` | `#f4f6fa` | Page background |
| `--border` | `#e2e8f0` | Card borders, image placeholders |
| `--radius` | `16px` | Cards |
| `--container` | `1120px` | Max content width |

Breakpoints: **≤ 960px** stacks the sidebar under Experience and shows projects in 2 columns. **≤ 720px** switches to the mobile layout.

## Running Locally

```bash
# Open directly
start index.html

# Or serve it
npx serve .
```

## Customize

1. Replace every `[placeholder]` in `index.html` with your details.
2. **Photo:** in `.hero__photo`, swap the `<span>` for `<img src="assets/images/profile.jpg" alt="Your Name" />`.
3. **CV:** put your resume at `assets/cv.pdf`.
4. **Skills:** change both the label and the `style="--level: 90%"` value on each `.skill`.
5. **Projects:** swap each `.project__img` `<span>` for an `<img>` and set the "View details" `href`.
6. **Email / LinkedIn:** update the `mailto:` and LinkedIn links in the hero and contact sections.
7. **Colors:** edit the variables at the top of `css/styles.css`.

## Deployment

Push to GitHub and enable **GitHub Pages**, or drag the folder into **Netlify** or **Vercel**.
