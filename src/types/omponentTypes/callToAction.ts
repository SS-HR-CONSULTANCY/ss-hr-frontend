import type { ButtonProps } from "@/components/ui/button"

export interface CTAButtonProps {
  href: string
  text: string
  variant?: ButtonProps["variant"]
}

export interface CallToActionProps {
  title: string
  description: string
  buttons: CTAButtonProps[]
}