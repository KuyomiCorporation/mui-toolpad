# Deployment

<p class="description">Deploying a Toolpad app is like deploying any other React application.</p>

## Build steps

This command will create an optimized production build for the Toolpad app and will output the generated files:

```sh
npm run build
```

Once the build has been made, you can deploy it to any service of your choice!

To serve the app once built, run:

```sh
npm start
```

## Overriding page display mode

You can override any page's display mode by adding the `toolpad-display` query parameter to the URL.

Possible values:

- `?toolpad-display=standalone` - Hide app shell
- `?toolpad-display=shell` - Show navigation sidebar
