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

- Multilanguage support / i18n
- Admin portal
- Bulma CSS framework
- fontawesome library
- netlify-cms

## Hackathon Launch Feb 18, 2021

We accomplished a lot during the 10-day span of rapid development. We bootstrapped a new Gatsby project with many features and technologies.

- Learned how to develop and deploy a Gatsby JAMstack complete website
- Learned to set up, design, and use a Content Management System (CMS) with a WYSIWYG user interface (UI) in a JAMstack context (netlify-cms)
- Learned to implement multilanguage support, including unicode typography (Chinese Simplified) into an entire website
- Improved our React development skills
- Familiarized ourselves with Bulma CSS Framework and Fontawesome libraries
- Further developed our skills in working with design, product, and engineering team members
- Gained additional experience in full-cycle software development
- Gained additional experience in build and deployment of a website onto a IaaS (Infrastructure as a Service) provider (Netlify)

## Dev Tips

- If you get an error on a line like this:

  `const image = frontmatter.image.childImageSharp.fluid.src`

Try running `gatsby clean`. This may happen when switching between branches.

- If you get an error like this:

  `Field "image" must not have a selection since type "String" has no subfields.`

  Then you are probably missing data in your markdown or your image path doesn't exist.

## Inspired by

This project was bootstrapped by this gatsby template: [gatsby-starter-i18n-bulma](https://github.com/kalwalt/gatsby-starter-i18n-bulma)
