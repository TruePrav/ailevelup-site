"use client";

import { useRef, useState } from "react";

export default function ProposalSignForm({
  proposalId,
  proposalTitle,
}: {
  proposalId: string;
  proposalTitle: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signed, setSigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    lastPos.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = { x, y };
    setSigned(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSigned(false);
    }
  };

  const handleSubmit = async () => {
    if (!signed) return;
    setSubmitting(true);
    const signature = canvasRef.current?.toDataURL("image/png") ?? "";
    try {
      const res = await fetch("/api/proposals/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId, signature }),
      });
      if (res.ok) {
        setSubmitted(true);
        window.location.reload();
      }
    } catch {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "#065F46" }}>
          Proposal Signed!
        </h3>
        <p className="text-sm" style={{ color: "#065F46" }}>
          Thank you. We&apos;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wide" style={{ color: "#6b7280" }}>
          Signature
        </label>
        {!signed ? (
          <span className="text-xs" style={{ color: "#9ca3af" }}>Draw below to sign</span>
        ) : (
          <button type="button" onClick={clearSignature} className="text-xs font-bold uppercase tracking-wide" style={{ color: "#EF4444" }}>
            Clear
          </button>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden mb-3" style={{ border: `2px dashed ${signed ? "#6366F1" : "#d1d5db"}`, background: "#fafafa" }}>
        <canvas
          ref={canvasRef}
          width={700}
          height={160}
          className="w-full cursor-crosshair"
          style={{ display: "block", touchAction: "none" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!signed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm" style={{ color: "#d1d5db" }}>Sign here — draw your signature above</span>
          </div>
        )}
      </div>
      <p className="text-xs" style={{ color: "#9ca3af" }}>
        By signing, you agree to the terms outlined in this proposal.
      </p>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!signed || submitting}
        className="mt-6 w-full py-4 rounded-xl text-base font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: signed ? "#6366F1" : "#d1d5db", color: "white", cursor: signed ? "pointer" : "not-allowed" }}
      >
        {!signed ? "Please draw your signature above" : submitting ? "Submitting..." : "Sign & Accept Proposal"}
      </button>
    </div>
  );
}
