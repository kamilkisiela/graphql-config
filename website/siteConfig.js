/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'GraphQL Config',
  tagline: 'One configuration for all your GraphQL tools',
  url: 'https://graphql-config.com',
  baseUrl: '/',
  editUrl: 'https://github.com/kamilkisiela/graphql-config/edit/master/docs/',
  noIndex: true,

  projectName: 'graphql-config',
  organizationName: 'The Guild',
  gaTrackingId: 'UA-125180910-4',

  headerLinks: [
    {
      doc: 'introduction',
      label: 'Documentation',
    },
    {href: 'https://github.com/kamilkisiela/graphql-config', label: 'GitHub'},
  ],

  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/logo.ico',

  colors: {
    primaryColor: '#000',
    secondaryColor: '#e535ab',
  },

  copyright: `Copyright © ${new Date().getFullYear()} The Guild`,

  highlight: {
		theme: 'androidstudio',// 'dracula',
		version: '9.15.10'
  },

  usePrism: true,

  scrollToTop: true,

  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js',
    '/js/code-block-buttons.js',
    '/js/legacy.js'
  ],

  onPageNav: 'separate',
  cleanUrl: true,

  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',

  enableUpdateBy: true,
  enableUpdateTime: true,

  repoUrl: 'https://github.com/kamilkisiela/graphql-config',
};

module.exports = siteConfig;
