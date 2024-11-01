import { Providers } from "@/components/providers";
import type { Meta, StoryObj } from "@storybook/react";

import Page from "./page";

const meta = {
  title: "Posts",
  component: Page,
  parameters: {
    layout: "centered"
  },
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    )
  ]
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
