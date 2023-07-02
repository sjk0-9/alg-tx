# Alg-TX

Alg-tx is no longer under development.
It is unlikely to function for very much longer (if it still does at all).

I'm releasing this so that people who have used it in the past can possibly redeem it and either re-purpose parts of it for their own work, or use it as a basis to build upon. If that's you, a rough summary of what you're about to dive into:

## Development

It's built using react and typescript using vite for development and building.
There's no backend servers or anything like that.
On build, a single package is created, that can be hosted anywhere (currently I used [fleek.co](https://fleek.co/)).
Simple as that.

To run locally:

```bash
yarn
yarn dev
```

And visit `localhost:3000` in your web-browser.

While I feel it's reasonably simple, it doesn't have any documentation or tests, so diving in mightn't be the easiest.
In absence of any real support, a brief overview of the codebase under the `src` directory:

In terms of the react JSX components, they vaguely follow the [atlassian design system](https://atlassian.design/):

* `src/foundations/` - most basic react building blocks of the app - css, colors, logos etc.
* `src/components/` - contains simple, reusable components.
* `src/patterns/` - more complex react components, made up of multiple subcomponents.
* `src/pages/` - the individual pages.

The html itself uses [tailwindcss](https://tailwindcss.com/) for styling.

Since this is a single page, non-hosted app, routing is performed by ReactRouter using the hashrouter.

All stateful management of the app is handled within `src/hooks/`, communicating with wallets, communicating with servers, all that is abstracted into react hooks. That said, there's very little in the way of persisted state that needs to be managed. The wallet configuration is via `use-persisted-state`, and logic for the contents of the web page (e.g. the atomic transaction helper), is just stored as URL state via React Router.

Finally, `src/lib/` contains the arbitrary helpers to abstract away complexity. Especially things for processing algorand data.

## Publishing

To publish your own version, you just have to run `yarn build`.
This will create a directory `dist/`.
Upload the full directory to any of a number of hosting services, and you'll be able to access the website, live, on the internet.
I used [fleek.co](https://fleek.co/) as it is insanely easy to set up and integrate so that pushes to github immediately start a build that then gets automatically released.

## Closing

I appreciate all the support and encouragement that the algorand community has been.
I've made some real friends here, and have had a wonderful time learning new things, and being able to support some very talented and creative people.
As such it's not easy for me to say goodbye to this project, but I do have to be realistic.
For a wide variety of reasons, this is going to be where I leave the journey.
I am sharing this here hoping that some mark I've left is able to carry on, and continue to be something that helps people, and maybe in a small way, continue to build towards the promises of an open, accessible and fair Web3.

All the best.

SJK0-9
