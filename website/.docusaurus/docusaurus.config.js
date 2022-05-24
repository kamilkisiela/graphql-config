export default {
  "title": "GraphQL Config",
  "tagline": "One configuration for all your GraphQL tools",
  "url": "https://graphql-config.com",
  "baseUrl": "/",
  "favicon": "img/logo.ico",
  "organizationName": "kamilkisiela",
  "projectName": "graphql-config",
  "themeConfig": {
    "sidebarCollapsible": false,
    "image": "img/logo.png",
    "navbar": {
      "title": "GraphQL Config",
      "logo": {
        "alt": "GraphQL Config Logo",
        "src": "img/logo.png"
      },
      "items": [
        {
          "to": "/introduction",
          "label": "Documentation",
          "position": "right"
        },
        {
          "href": "https://github.com/kamilkisiela/graphql-config",
          "label": "GitHub",
          "position": "right"
        }
      ],
      "hideOnScroll": false
    },
    "footer": {
      "style": "dark",
      "copyright": "Copyright © 2021 The Guild. All rights reserved.",
      "links": [
        {
          "title": "Docs",
          "items": [
            {
              "label": "Introduction",
              "to": "introduction"
            },
            {
              "label": "Developer Guide",
              "to": "load-config"
            }
          ]
        },
        {
          "title": "Community",
          "items": [
            {
              "label": "Discord",
              "href": "https://discord.gg/xud7bH9"
            },
            {
              "label": "Other projects",
              "href": "https://github.com/the-guild-org/Stack"
            },
            {
              "label": "Mailing List",
              "href": "https://upscri.be/19qjhi"
            },
            {
              "label": "Community Meetings",
              "href": "https://github.com/the-guild-org/community-meetings"
            }
          ]
        },
        {
          "title": "Social",
          "items": [
            {
              "label": "Blog",
              "href": "https://medium.com/the-guild"
            },
            {
              "label": "GitHub",
              "href": "https://github.com/kamilkisiela/graphql-config"
            },
            {
              "label": "Twitter",
              "href": "https://twitter.com/kamilkisiela"
            },
            {
              "label": "LinkedIn",
              "href": "https://www.linkedin.com/company/the-guild-software"
            }
          ]
        }
      ]
    },
    "googleAnalytics": {
      "trackingID": "UA-125180910-4"
    },
    "algolia": {
      "appId": "ANRJKXZTRW",
      "apiKey": "811d453fc7f80306044dd5cc4b87e064",
      "indexName": "theguild",
      "algoliaOptions": {},
      "contextualSearch": false,
      "searchParameters": {}
    },
    "prism": {
      "theme": {
        "plain": {
          "color": "#F8F8F2",
          "backgroundColor": "#282A36"
        },
        "styles": [
          {
            "types": [
              "prolog",
              "constant",
              "builtin"
            ],
            "style": {
              "color": "rgb(189, 147, 249)"
            }
          },
          {
            "types": [
              "inserted",
              "function"
            ],
            "style": {
              "color": "rgb(80, 250, 123)"
            }
          },
          {
            "types": [
              "deleted"
            ],
            "style": {
              "color": "rgb(255, 85, 85)"
            }
          },
          {
            "types": [
              "changed"
            ],
            "style": {
              "color": "rgb(255, 184, 108)"
            }
          },
          {
            "types": [
              "punctuation",
              "symbol"
            ],
            "style": {
              "color": "rgb(248, 248, 242)"
            }
          },
          {
            "types": [
              "string",
              "char",
              "tag",
              "selector"
            ],
            "style": {
              "color": "rgb(255, 121, 198)"
            }
          },
          {
            "types": [
              "keyword",
              "variable"
            ],
            "style": {
              "color": "rgb(189, 147, 249)",
              "fontStyle": "italic"
            }
          },
          {
            "types": [
              "comment"
            ],
            "style": {
              "color": "rgb(98, 114, 164)"
            }
          },
          {
            "types": [
              "attr-name"
            ],
            "style": {
              "color": "rgb(241, 250, 140)"
            }
          }
        ]
      },
      "additionalLanguages": []
    },
    "colorMode": {
      "defaultMode": "light",
      "disableSwitch": false,
      "respectPrefersColorScheme": false,
      "switchConfig": {
        "darkIcon": "🌜",
        "darkIconStyle": {},
        "lightIcon": "🌞",
        "lightIconStyle": {}
      }
    },
    "docs": {
      "versionPersistence": "localStorage"
    },
    "metadatas": [],
    "hideableSidebar": false
  },
  "scripts": [
    "/js/light-mode-by-default.js",
    "/js/legacy.js",
    {
      "src": "https://the-guild.dev/static/banner.js",
      "async": true,
      "defer": true
    }
  ],
  "presets": [
    [
      "/home/ardat_000/Guild/graphql-config/website/node_modules/@docusaurus/preset-classic/src/index.js",
      {
        "docs": {
          "path": "docs",
          "routeBasePath": "/",
          "include": [
            "**/*.md",
            "**/*.mdx"
          ],
          "sidebarPath": "/home/ardat_000/Guild/graphql-config/website/sidebars.js",
          "editUrl": "https://github.com/kamilkisiela/graphql-config/edit/master/website/"
        },
        "theme": {
          "customCss": "/home/ardat_000/Guild/graphql-config/website/src/css/custom.css"
        },
        "sitemap": {
          "cacheTime": 600600,
          "changefreq": "weekly",
          "priority": 0.5
        }
      }
    ]
  ],
  "onBrokenLinks": "warn",
  "onBrokenMarkdownLinks": "warn",
  "baseUrlIssueBanner": true,
  "i18n": {
    "defaultLocale": "en",
    "locales": [
      "en"
    ],
    "localeConfigs": {}
  },
  "onDuplicateRoutes": "warn",
  "customFields": {},
  "plugins": [],
  "themes": [],
  "titleDelimiter": "|",
  "noIndex": false
};