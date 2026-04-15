"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const sectionStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "16px",
};

const btnStyle: React.CSSProperties = {
  background: "var(--accent, #6366F1)",
  color: "white",
  fontSize: "13px",
  fontWeight: 700,
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

const ghostBtnStyle: React.CSSProperties = {
  background: "transparent",
  color: "var(--text-muted)",
  fontSize: "13px",
  fontWeight: 700,
  padding: "10px 20px",
  borderRadius: "10px",
  border: "1px solid var(--border)",
  cursor: "pointer",
};

export default function SignatureClient({
  initialSignature,
}: {
  initialSignature: string | null;
}) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentSig, setCurrentSig] = useState<string | null>(initialSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drawing = false;
    let lastX = 0;
    let lastY = 0;

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const cx =
        "touches" in e
          ? e.touches[0]?.clientX ?? 0
          : (e as MouseEvent).clientX;
      const cy =
        "touches" in e
          ? e.touches[0]?.clientY ?? 0
          : (e as MouseEvent).clientY;
      return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      drawing = true;
      const p = getPos(e);
      lastX = p.x;
      lastY = p.y;
    };
    const move = (e: MouseEvent | TouchEvent) => {
      if (!drawing) return;
      e.preventDefault();
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
      lastX = p.x;
      lastY = p.y;
      setHasDrawn(true);
    };
    const end = () => {
      drawing = false;
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mouseleave", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      canvas.removeEventListener("touchend", end);
    };
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setMessage("");
    setError("");
  };

  const cropToInk = (source: HTMLCanvasElement): string => {
    const ctx = source.getContext("2d");
    if (!ctx) return source.toDataURL("image/png");
    const { width, height } = source;
    const img = ctx.getImageData(0, 0, width, height).data;

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = img[(y * width + x) * 4 + 3];
        if (alpha > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < 0) return source.toDataURL("image/png"); // empty

    // Small padding so lines aren't flush with the edge
    const pad = 4;
    const sx = Math.max(0, minX - pad);
    const sy = Math.max(0, minY - pad);
    const sw = Math.min(width, maxX + pad) - sx;
    const sh = Math.min(height, maxY + pad) - sy;

    const out = document.createElement("canvas");
    out.width = sw;
    out.height = sh;
    const outCtx = out.getContext("2d");
    if (!outCtx) return source.toDataURL("image/png");
    outCtx.drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
    return out.toDataURL("image/png");
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) {
      setError("Draw a signature first");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const dataUrl = cropToInk(canvas);
      const res = await fetch("/api/admin/settings/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setCurrentSig(dataUrl);
      setMessage("Saved. It will appear on every proposal from now on.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Remove your saved signature? Proposals will show a blank signature area until you save a new one.")) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Remove failed");
      setCurrentSig(null);
      setMessage("Signature removed.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {currentSig && (
        <div style={sectionStyle}>
          <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>
            Current signature
          </h2>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSig}
              alt="Current signature"
              style={{ maxWidth: "260px", maxHeight: "90px", filter: "brightness(0)" }}
            />
          </div>
          <button type="button" onClick={handleRemove} style={ghostBtnStyle} disabled={saving}>
            Remove signature
          </button>
        </div>
      )}

      <div style={sectionStyle}>
        <h2 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>
          {currentSig ? "Draw a new signature" : "Draw your signature"}
        </h2>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          This image is stored in your database and auto-injected on the preparer side of every proposal.
          Drawn in black on a transparent background.
        </p>

        <div
          style={{
            background: "#ffffff",
            border: "2px dashed #cbd5e1",
            borderRadius: "12px",
            padding: "8px",
            marginBottom: "12px",
          }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={160}
            style={{
              width: "100%",
              height: "160px",
              display: "block",
              touchAction: "none",
              cursor: "crosshair",
            }}
          />
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <button type="button" onClick={handleSave} disabled={saving || !hasDrawn} style={btnStyle}>
            {saving ? "Saving..." : "Save signature"}
          </button>
          <button type="button" onClick={handleClear} disabled={saving} style={ghostBtnStyle}>
            Clear
          </button>
          {message && (
            <span className="text-sm" style={{ color: "#059669" }}>
              {message}
            </span>
          )}
          {error && (
            <span className="text-sm" style={{ color: "#DC2626" }}>
              {error}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
