"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ServiceArtProps = {
  src: string;
  hasImage: boolean;
  sizes: string;
  className?: string;
};

/** Service sculpture PNG, or a white studio sphere if the file is missing. */
export function ServiceArt({ src, hasImage, sizes, className }: ServiceArtProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative grid place-items-center", className)}>
      {hasImage && !failed ? (
        <Image
          src={src}
          alt=""
          width={600}
          height={600}
          sizes={sizes}
          className="size-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        // 480px inside a 600px frame
        <div className="aspect-square w-[80%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff_0%,#f3f3f3_38%,#d9d9d9_100%)] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.18),0_16px_32px_-16px_rgba(0,0,0,0.12)]" />
      )}
    </div>
  );
}
