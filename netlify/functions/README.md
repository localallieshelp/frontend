# Netlify Functions (via AWS Lambda)

Use `netlify dev` CLI utility to use functions, then access them via:

`http://localhost:8888/.netlify/functions/square`

```
4:08:10 PM: ────────────────────────────────────────────────────────────────
4:08:10 PM: 2. Functions bundling
4:08:10 PM: ────────────────────────────────────────────────────────────────
4:08:10 PM: ​
4:08:10 PM: Packaging Functions from netlify/functions directory:
4:08:10 PM: - square.js
4:08:10 PM: ​
4:08:10 PM: ────────────────────────────────────────────────────────────────
4:08:10 PM: Dependencies installation error
4:08:10 PM: ────────────────────────────────────────────────────────────────
4:08:10 PM: ​
4:08:10 PM: Error message
4:08:10 PM: A Netlify Function is using "square" but that dependency has not been installed yet.
4:08:10 PM: ​
4:08:10 PM: By default, dependencies inside a Netlify Function's "package.json" are not automatically installed.
There are several ways to fix this problem:
4:08:10 PM: - Removing your Function's "package.json" and adding the dependencies to the project's top-level "package.json" instead. This is the fastest and safest solution.
4:08:10 PM: - Running "npm install" or "yarn" inside your Netlify Function in your build command.
4:08:10 PM: - Adding the following plugin to your "netlify.toml":
4:08:10 PM: ​
4:08:10 PM: [[plugins]]
4:08:10 PM: package = "@netlify/plugin-functions-install-core"
4:08:10 PM: ​​
4:08:10 PM: In file "/opt/build/repo/netlify/functions/square.js"
4:08:10 PM: Cannot find module 'square'
4:08:10 PM: Require stack:
4:08:10 PM: - /opt/buildhome/.netlify-build-nvm/versions/node/v12.16.3/lib/node_modules/@netlify/build/node_modules/@netlify/zip-it-and-ship-it/src/node_dependencies/resolve.js
4:08:10 PM: - /opt/buildhome/.netlify-build-nvm/versions/node/v12.16.3/lib/node_modules/@netlify/build/node_modules/@netlify/zip-it-and-ship-it/src/node_dependencies/index.js
4:08:10 PM: - /opt/buildhome/.netlify-build-nvm/versions/node/v12.16.3/lib/node_modules/@netlify/build/node_modules/@netlify/zip-it-and-ship-it/src/main.js
4:08:10 PM: - /opt/buildhome/.netlify-build-nvm/versions/node/v12.16.3/lib/node_modules/@netlify/build/src/plugins_core/functions/index.js
4:08:10 PM: - /opt/buildhome/.netlify-build-nvm/versions/node/v12.16.3/lib/node_modules/@netlify/build/src/commands/get.js
4:08:10 PM: - /opt/buildhome/.netlify-build-nvm/versions/node/v12.16.3/lib/node_modules/@netlify/build/src/core/main.js
4:08:10 PM: - /opt/buildhome/.netlify-build-nvm/versions/node/v12.16.3/lib/node_modules/@netlify/build/src/core/bin.js
```
