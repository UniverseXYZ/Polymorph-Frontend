require('babel-register')({
  presets: ['es2015', 'react'],
});

const Sitemap = require('react-router-sitemap').default;
const router = require('./sitemap-routes').default;

function generateSitemap() {
  return new Sitemap(router).build('https://universe.xyz/').save('./public/sitemap.xml');
}

generateSitemap();
