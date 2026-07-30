import { redirect } from "next/navigation";
import BookingPageClient from "./BookingPageClient";

export const metadata = {
  title: "Reserve Your Spot | Wellness Weekend 2026",
};

export default function BookPage({
  searchParams,
}: {
  searchParams: { type?: string; confirmed?: string };
}) {
  const type = searchParams.type;
  if (type !== "aerial" && type !== "paddle") {
    redirect("/#build");
  }
  return (
    <BookingPageClient
      type={type}
      confirmed={searchParams.confirmed === "1"}
    />
  );
}
