![active development](https://img.shields.io/badge/active%20dev-yes-brightgreen.svg)
![repo size](https://img.shields.io/github/languages/code-size/jazz-sim/crochet-craft)
[![W3C Validation - https://validator.nu/](https://img.shields.io/w3c-validation/default?targetUrl=https%3A%2F%2Fcrochetcraft.jtai.ca%2F&label=w3c%20check)](https://validator.nu/?doc=https%3A%2F%2Fcrochetcraft.jtai.ca%2F)
![Cloudflare Pages Branch Preview Check](https://img.shields.io/github/check-runs/jazz-sim/crochet-craft/main?nameFilter=Cloudflare%20Pages&style=flat&logo=cloudflarepages&label=Cloudflare%20Pages%20Branch%20Preview%20Check)
![CodeQL](https://github.com/jazz-sim/crochet-craft/actions/workflows/github-code-scanning/codeql/badge.svg)

# CrochetCraft

🧶3D modelling of crochet designs!

> [!NOTE]
> You can view the [literature review here](https://drive.google.com/file/d/1i-xJP93g1HtWESavKybHgczw1jFTRnaT/view?usp=sharing) from SE 390's Mini Project 3.

> [!NOTE]
> You can view the [final report video here](https://drive.google.com/file/d/1MD9toIfjKfOauaXvyQwO2jPIVvGqYSwL/view) from SE 491. Due to conflicting availabilities at the end of the 4B term, a majority of the video is voiced by text-to-speech.

## Repository Structure

- [crochet-stitcher](crochet-stitcher): contains the library that processes and renders the crochet pattern.
- [crochetcraft](crochetcraft): contains the web frontend for crochet-stitcher.
- SE 491 Report.pdf: in the root of the repository; the final report for the FYDP.

## Deployment infrastructure

Deployment is done via [Cloudflare Pages](https://pages.cloudflare.com/). Svelte's [adapter-cloudflare](https://svelte.dev/docs/kit/adapter-cloudflare) is used to build the app for Cloudflare Pages (the adapter is not explicitly specified, but `adapter-auto` detects its environment and uses the correct adapter automatically).
