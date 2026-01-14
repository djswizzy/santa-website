# Santa's Website 🎅

A static website built with Jekyll.

## Prerequisites

- Ruby (version 2.7 or higher)
- Bundler

## Getting Started

1. **Install dependencies:**

   ```bash
   bundle install
   ```

2. **Run the development server:**

   ```bash
   bundle exec jekyll serve
   ```

3. **Open your browser:**

   Visit [http://localhost:4000](http://localhost:4000) to see the site.

## Building for Production

To build the static files for deployment:

```bash
bundle exec jekyll build
```

The generated site will be in the `_site` directory.

## Project Structure

```
├── _config.yml      # Site configuration
├── _layouts/        # Page layouts
├── _includes/       # Reusable components
├── assets/
│   └── css/         # Stylesheets
├── index.html       # Homepage
├── about.md         # About page
├── Gemfile          # Ruby dependencies
└── README.md        # This file
```

## Customization

- Edit `_config.yml` to change site title and description
- Modify files in `_layouts/` to change page structure
- Update `assets/css/style.css` for styling changes
- Add new pages as `.html` or `.md` files with front matter

## License

Made with ❤️ at the North Pole
