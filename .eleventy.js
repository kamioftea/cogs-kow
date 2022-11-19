const { EleventyRenderPlugin } = require("@11ty/eleventy");
const feather = require('feather-icons');
const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
const markdown = require("markdown-it")()

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin)
    eleventyConfig.addPlugin(inclusiveLangPlugin);

    eleventyConfig.ignores.add("README.md");
    eleventyConfig.ignores.add("/**/*.template.njk");
    eleventyConfig.ignores.add("/**/*.draft.njk");
    eleventyConfig.ignores.add("/**/*.xcf");

    // IntelliJ doesn't like frontmatter before <!doctype html> in root layout
    // So add the layout defaults here
    eleventyConfig.addGlobalData('layout', 'page.njk')

    eleventyConfig.addPassthroughCopy({
       'static/assets/fonts': '/fonts',
       'static/assets/images': '/images',
       'static/assets/favicon.ico': '/favicon.ico',
    });

    eleventyConfig.addNunjucksFilter('icon', (name) => feather.icons[name]?.toSvg())
    eleventyConfig.addNunjucksFilter('kebabCase', (str) => str.replaceAll(/[^A-Za-z0-9-]+/g, '-'))
    eleventyConfig.addNunjucksFilter('markdown', (string, value) => {
        if (value === 'inline') {
            return markdown.renderInline(string ?? '')
        }

        return markdown.render(string ?? '')
    })

    return {
        dir: {
            input: "static/views",
            output: "static/dist",
            layouts: "../layouts",
            includes: "../includes"
        },
        passthroughFileCopy: true,
        markdownTemplateEngine: 'njk',
        pathPrefix: process.env.PATH_PREFIX ?? ''
    }
};
