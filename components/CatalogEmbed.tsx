"use client";

import { useEffect, useRef } from "react";
import { useTrackEvent } from "@/lib/useTrackEvent";
import { useAccess } from "@/lib/access";
import { CatalogAccessGate } from "@/components/CatalogAccessGate";
import { CompoundedCatalog } from "@/components/CompoundedCatalog";

export function CatalogEmbed({
  className = "",
  source = "catalog_embed",
}: {
  className?: string;
  source?: string;
}) {
  const track = useTrackEvent();
  const interactedRef = useRef(false);
  const access = useAccess();

  useEffect(() => {
    track("catalog_embed_view", source);
  }, [source, track]);

  function onInteract() {
    if (interactedRef.current) return;
    interactedRef.current = true;
    track("catalog_embed_interaction", source);
  }

  if (!access) {
    return (
      <div className={className}>
        <CatalogAccessGate source={source} />
      </div>
    );
  }

  return (
    <div className={className}>
      <CompoundedCatalog onInteract={onInteract} source={source} />
    </div>
  );
}
