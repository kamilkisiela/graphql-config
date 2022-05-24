
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';
export default [
{
  path: '/',
  component: ComponentCreator('/','deb'),
  exact: true,
},
{
  path: '/__docusaurus/debug',
  component: ComponentCreator('/__docusaurus/debug','3d6'),
  exact: true,
},
{
  path: '/__docusaurus/debug/config',
  component: ComponentCreator('/__docusaurus/debug/config','914'),
  exact: true,
},
{
  path: '/__docusaurus/debug/content',
  component: ComponentCreator('/__docusaurus/debug/content','c28'),
  exact: true,
},
{
  path: '/__docusaurus/debug/globalData',
  component: ComponentCreator('/__docusaurus/debug/globalData','3cf'),
  exact: true,
},
{
  path: '/__docusaurus/debug/metadata',
  component: ComponentCreator('/__docusaurus/debug/metadata','31b'),
  exact: true,
},
{
  path: '/__docusaurus/debug/registry',
  component: ComponentCreator('/__docusaurus/debug/registry','0da'),
  exact: true,
},
{
  path: '/__docusaurus/debug/routes',
  component: ComponentCreator('/__docusaurus/debug/routes','244'),
  exact: true,
},
{
  path: '/search',
  component: ComponentCreator('/search','a27'),
  exact: true,
},
{
  path: '/',
  component: ComponentCreator('/','8fb'),
  
  routes: [
{
  path: '/documents',
  component: ComponentCreator('/documents','a85'),
  exact: true,
},
{
  path: '/extensions',
  component: ComponentCreator('/extensions','586'),
  exact: true,
},
{
  path: '/graphql-config',
  component: ComponentCreator('/graphql-config','ba9'),
  exact: true,
},
{
  path: '/graphql-project-config',
  component: ComponentCreator('/graphql-project-config','09c'),
  exact: true,
},
{
  path: '/installation',
  component: ComponentCreator('/installation','ed8'),
  exact: true,
},
{
  path: '/introduction',
  component: ComponentCreator('/introduction','f32'),
  exact: true,
},
{
  path: '/load-config',
  component: ComponentCreator('/load-config','6c3'),
  exact: true,
},
{
  path: '/loaders',
  component: ComponentCreator('/loaders','754'),
  exact: true,
},
{
  path: '/migration',
  component: ComponentCreator('/migration','550'),
  exact: true,
},
{
  path: '/schema',
  component: ComponentCreator('/schema','ee4'),
  exact: true,
},
{
  path: '/usage',
  component: ComponentCreator('/usage','a89'),
  exact: true,
},
]
},
{
  path: '*',
  component: ComponentCreator('*')
}
];
