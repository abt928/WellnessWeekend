"use client";
import Image from "next/image";
import { useState } from "react";

interface PartnerCardProps {
  name: string;
  role: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  /** When false, skip the <Image> entirely and show the name (no 404 request). */
  logoReady?: boolean;
}

export default function PartnerCard({ name, role, logo, logoWidth, logoHeight, logoReady = true }: PartnerCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="partner-card partner-card-logo">
      <div className="partner-logo-img-wrap">
        {!logoReady || imgFailed ? (
          <span className="partner-logo-text">{name}</span>
        ) : (
          <Image
            src={logo}
            alt={name}
            width={logoWidth}
            height={logoHeight}
            onError={() => setImgFailed(true)}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        )}
      </div>
      <div className="partner-role">{role}</div>
    </div>
  );
}
