# Local Allies

[![Netlify Status](https://api.netlify.com/api/v1/badges/d7f25446-66fd-49ed-9593-fd82da45067c/deploy-status)](https://app.netlify.com/sites/savesmb/deploys)

Small businesses across the United States need our help. Nearly a quarter of US small merchants are closed and overall revenue is still down for many due to the COVID-19 pandemic.

We've built a platform for small businesses with little-to-no online presence and those disproportionately hurt by COVID-19 to get help with marketing and social.

## Getting Started

This starter is developed within the Gatsby ecosystem. It requires `node.js`, `npm`, `yarn` and `gatsby-cli` to be installed.

Install project packages:

```
yarn install
```

After yarn has finished, begin dev:

```
gatsby develop
```

The site will be served at `localhost:8000`

#### Admin CMS

Open a separate terminal and run the following command. This will allow you to access the netlify-cms locally at: `localhost:8000/admin` or the same port the gatsby app is running.

```
npx netlify-cms-proxy-server
```

## Features

- Multilanguage support
- Admin portal
- Bulma CSS framework
- fontawesome
- i18n
- netlify-cms

## Hackathon Launch Feb 18, 2021

We accomplished a lot during the 10-day span of rapid development.

## Dev Tips

- If you get an error on a line like this:

  `const image = frontmatter.image.childImageSharp.fluid.src`

Try running `gatsby clean`. This may happen when switching between branches.

- If you get an error like this:

  `Field "image" must not have a selection since type "String" has no subfields.`

  Then you are probably missing data in your markdown or your image path doesn't exist.

## Inspired by

This project was bootstrapped by this gatsby template: [gatsby-starter-i18n-bulma](https://github.com/kalwalt/gatsby-starter-i18n-bulma)
