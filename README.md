![active development](https://img.shields.io/badge/active%20dev-yes-brightgreen.svg)
[![W3C Validation - https://validator.nu/](https://img.shields.io/w3c-validation/default?targetUrl=https%3A%2F%2Fcrochetcraft.jtai.ca%2F&label=w3c%20check)](https://validator.nu/?doc=https%3A%2F%2Fcrochetcraft.jtai.ca%2F)
# crochet-craft \[EXPERIMENTAL BRANCH: three.js Testing\]
🧶3D modelling of crochet designs!

> [!NOTE]
> Some work from Mini Project 3 (MP3) from SE390 can be found in the `mp3-lit-review` folder. 

> [!WARNING]
> This is an experimental branch. Everything here is meant to document our testing and investigation only.
> Do not attempt to merge into `main`.

## Overview

This branch is meant to test out [three.js](https://threejs.org/). 

### Init - 2023-04-04
Adds a test page for three.js, with the sample code provided by the [package description](https://yarnpkg.com/package?name=three), made to work with svelte with minimal edits.

Note: The `WebGLRenderer` constructor will attempt to access the `document` object, which will result in an error with svelte. The current fix is to wrap it (and the entire sample code) in a callback function to svelte's `onMount`.
