# Save Small Businesses Hack 2021

[![Netlify Status](https://api.netlify.com/api/v1/badges/d7f25446-66fd-49ed-9593-fd82da45067c/deploy-status)](https://app.netlify.com/sites/savesmb/deploys)

You can view the starter at this link: https://gatsby-starter-i18n-bulma.netlify.com

A gatsby multilanguage template with bulma and i18n. This project is under heavy development, consider that frequent changes can break compatibility.

## Dev setup

Run the yarn installer to install all the packages and dependencies:

```
yarn install
```

Open a separate terminal and run the following command. This will allow you to
access the netlify-cms locally at: `localhost:8000/admin` or the same port
the gatsby app is running.

```
npx netlify-cms-proxy-server
```

After yarn has finished to install all the packages then you can run:

```
gatsby develop
```

## Dev Tips

- If you get an error on a line like this:

  `const image = frontmatter.image.childImageSharp.fluid.src`

Try running `gatsby clean`. This may happen when switching between branches.

- If you get an error like this:

  `Field "image" must not have a selection since type "String" has no subfields.`

  Then you are probably missing data in your markdown or your image path doesn't exist.

## Features

A simple website with multilanguage support, blogging, bulma css, fontawesome, i18n, netlify-cms
and much more...

### Language switcher

With this starter you can switch between different languages pages with different names for example:

`en/artworks/`

to

`/it/opere/`

## Plugins

This starter use these Gatsby.js Plugins:

- gatsby-plugin-google-analytics
- gatsby-plugin-i18n
- gatsby-plugin-i18n-tags
- gatsby-plugin-manifest
- gatsby-plugin-netlify
- gatsby-plugin-netlify-cms
- gatsby-plugin-offline
- gatsby-plugin-purgecss
- gatsby-plugin-react-helmet
- gatsby-plugin-remove-trailing-slashes
- gatsby-plugin-robots-txt
- gatsby-plugin-sass
- gatsby-plugin-sharp
- gatsby-plugin-sitemap
- gatsby-remark-copy-linked-files
- gatsby-remark-images
- gatsby-remark-relative-images
- gatsby-source-filesystem
- gatsby-transformer-javascript-frontmatter
- gatsby-transformer-json
- gatsby-transformer-remark
- gatsby-transformer-sharp

## Inspired by

This project in part is based on the Netify template: [gatsby-starter-netlify-cms](https://github.com/netlify-templates/gatsby-starter-netlify-cms)
and the [gatsby-starter-contentful-i18n](https://github.com/mccrodp/gatsby-starter-contentful-i18n)
But a special mention i reserved to [gatsby-plugin-i18n](https://github.com/angeloocana/gatsby-plugin-i18n)

## Documentation

For more information, see the [wiki page][4509389d]

[4509389d]: https://github.com/kalwalt/gatsby-starter-i18n-bulma/wiki "wiki"
