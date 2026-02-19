"use client";

import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
}

function openShareWindow(shareUrl: string) {
  window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-400 font-medium">Share:</span>
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => {
          const Icon = link.icon;
          const isEmail = link.name === "Email";

          return isEmail ? (
            <a
              key={link.name}
              href={link.url}
              aria-label={`Share via ${link.name}`}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a1a1a] text-gray-400 hover:bg-[#5ABA47]/20 hover:text-[#5ABA47] transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ) : (
            <button
              key={link.name}
              onClick={() => openShareWindow(link.url)}
              aria-label={`Share on ${link.name}`}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a1a1a] text-gray-400 hover:bg-[#5ABA47]/20 hover:text-[#5ABA47] transition-colors cursor-pointer"
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
