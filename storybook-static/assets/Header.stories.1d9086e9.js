import{H as e}from"./Header.eb1db6c7.js";import{j as t}from"./jsx-runtime.423b3722.js";import"./Button.5bf98c82.js";import"./defineProperty.6bc462a7.js";import"./index.97d7773a.js";import"./iframe.b8d81469.js";const g={title:"Example/Header",component:e,parameters:{storySource:{source:`import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Header } from './Header';

export default {
  title: 'Example/Header',
  component: Header,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {
    name: 'Jane Doe',
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
`,locationsMap:{"logged-in":{startLoc:{col:48,line:15},endLoc:{col:78,line:15},startBody:{col:48,line:15},endBody:{col:78,line:15}},"logged-out":{startLoc:{col:48,line:15},endLoc:{col:78,line:15},startBody:{col:48,line:15},endBody:{col:78,line:15}}}},layout:"fullscreen"}},o=n=>t(e,{...n}),r=o.bind({});r.args={user:{name:"Jane Doe"}};const a=o.bind({});a.args={};const i=["LoggedIn","LoggedOut"];export{r as LoggedIn,a as LoggedOut,i as __namedExportsOrder,g as default};
//# sourceMappingURL=Header.stories.1d9086e9.js.map
