import{B as t}from"./Button.5bf98c82.js";import{j as r}from"./jsx-runtime.423b3722.js";import"./defineProperty.6bc462a7.js";import"./index.97d7773a.js";import"./iframe.b8d81469.js";const g={parameters:{storySource:{source:`import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
`,locationsMap:{primary:{startLoc:{col:48,line:17},endLoc:{col:78,line:17},startBody:{col:48,line:17},endBody:{col:78,line:17}},secondary:{startLoc:{col:48,line:17},endLoc:{col:78,line:17},startBody:{col:48,line:17},endBody:{col:78,line:17}},large:{startLoc:{col:48,line:17},endLoc:{col:78,line:17},startBody:{col:48,line:17},endBody:{col:78,line:17}},small:{startLoc:{col:48,line:17},endLoc:{col:78,line:17},startBody:{col:48,line:17},endBody:{col:78,line:17}}}}},title:"Example/Button",component:t,argTypes:{backgroundColor:{control:"color"}}},o=n=>r(t,{...n}),e=o.bind({});e.args={primary:!0,label:"Button"};const a=o.bind({});a.args={label:"Button"};const l=o.bind({});l.args={size:"large",label:"Button"};const s=o.bind({});s.args={size:"small",label:"Button"};const y=["Primary","Secondary","Large","Small"];export{l as Large,e as Primary,a as Secondary,s as Small,y as __namedExportsOrder,g as default};
//# sourceMappingURL=Button.stories.98adb50d.js.map
