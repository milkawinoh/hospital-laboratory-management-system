import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard"); // Automatically redirects to the dashboard
  return null;}
