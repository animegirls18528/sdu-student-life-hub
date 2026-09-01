import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SDU Student Life Hub",
  description: "Sign in to your account",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
