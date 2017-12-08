# Portfolio Theme for Grav

This is my personal portfolio theme for use with [Grav CMS](https://getgrav.org). See it in use [here](http://andreacrawford.design/).

## Installing this theme
- Navigate to grav's themes directory (grav/user/themes) and download the theme

      git clone https://github.com/acrawford13/portfolio-theme.git
      cd portfolio-theme

- Use npm to install packages and build theme files

      npm install
      grunt build

- Update your `system.yaml` file (grav/user/config/system.yaml) to use `theme: folio` (~line 7)
