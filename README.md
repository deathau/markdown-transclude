# Markdown Transclusion action

This action takes in a markdown file with transclusions specified in the format ` ![[file-to-include]] ` and processes the transclusions into an output markdown file.

## Inputs

### `source`

**Required** The path of the markdown file containing transclusions. Default `"templates/README.md"`.

### `dest`

**Required** The path of the markdown file to output. Default `"README.md"`.

## Outputs

### `markdown`

The markdown output from the processing

### `destPath`

The path of the output file (which was specified in the inputs)

## Example usage

```yaml
uses: deathau/markdown-transclude@v1
with:
  source: templates/README.md
  dest: README.md
```

You can get an idea of the input and output by looking at `./templates/README.md` in the repository

## Pricing
Huh? This is an open-source plugin I made *for fun*. It's completely free.
However, if you absolutely *have* to send me money because you like it that
much, feel free to throw some coins in my hat via the following:

[![GitHub Sponsors](https://img.shields.io/github/sponsors/deathau?style=social)](https://github.com/sponsors/deathau)
[![Paypal](https://img.shields.io/badge/paypal-deathau-yellow?style=social&logo=paypal)](https://paypal.me/deathau)

## v1
Initial release!
- Tanscludes file contents using `![[other-file]]` embed syntax