import { useToast, type ToasterToast } from "@/hooks/use-toast";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./button";
import { ToastProvider } from "./toast";

function Component(props: ToasterToast) {
  const { toast } = useToast();
  return (
    <>
      <Button onClick={() => toast(props)}>Show toast</Button>
      <ToastProvider />
    </>
  );
}

const meta = {
  title: "Components/Toast",
  component: Component,
  parameters: {
    layout: "centered"
  },
  args: {
    title: "Toast title",
    description: "Toast description"
  }
} satisfies Meta<ToasterToast>;

export default meta;
type Story = StoryObj<ToasterToast>;

export const Default: Story = {};
