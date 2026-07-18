import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Sharanya Properties Hub — Home"
      className={cn(
        "group inline-flex items-center",
        className
      )}
    >
      <Image
        src="/brand/sharanya-logo.jpg"
        alt="Sharanya Properties Hub"
        width={220}
        height={65}
        priority
        className={cn(
          "h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105",
          light && "brightness-110"
        )}
      />
    </Link>
  );
}
