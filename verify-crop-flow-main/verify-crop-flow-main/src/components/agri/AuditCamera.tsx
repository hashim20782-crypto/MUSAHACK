import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Camera, Check, Loader2, RotateCcw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { processAuditPhoto, type ProcessedPhoto } from "@/lib/photo";

type CameraError = "permission" | "unavailable" | "process" | null;

/**
 * Mandatory fraud-prevention capture: crop + scale reading + physical grade
 * card must all be inside one frame.
 */
export function AuditCamera({
  photo,
  onCaptured,
  onCleared,
}: {
  photo: ProcessedPhoto | null;
  onCaptured: (p: ProcessedPhoto) => void;
  onCleared: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [live, setLive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<CameraError>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startCamera() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("unavailable");
      fileRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setLive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      setError(name === "NotAllowedError" ? "permission" : "unavailable");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLive(false);
  }

  async function shoot() {
    const video = videoRef.current;
    if (!video) return;
    setBusy(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 960;
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob((b) => res(b), "image/jpeg", 0.92),
      );
      if (!blob) throw new Error("capture failed");
      onCaptured(await processAuditPhoto(blob));
      stopCamera();
    } catch {
      setError("process");
    } finally {
      setBusy(false);
    }
  }

  async function fromFile(file: File) {
    setBusy(true);
    try {
      onCaptured(await processAuditPhoto(file));
      setError(null);
    } catch {
      setError("process");
    } finally {
      setBusy(false);
    }
  }

  /* ---------- captured preview ---------- */
  if (photo) {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl border border-border">
          <img
            src={photo.previewUrl}
            alt="Captured audit photo showing the crop, scale reading and grade card"
            className="aspect-4/3 w-full object-cover"
          />
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-2xl glass-dark px-3 py-2 text-sm font-semibold text-white">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Audit photo attached · {(photo.bytes / 1024).toFixed(0)} KB
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-14 rounded-2xl text-base"
            onClick={() => {
              onCleared();
              void startCamera();
            }}
          >
            <RotateCcw className="size-5" aria-hidden="true" />
            Retake
          </Button>
          <Button
            type="button"
            size="lg"
            className="h-14 rounded-2xl bg-success text-base text-primary-foreground hover:bg-success/90"
            disabled
          >
            <Check className="size-5" aria-hidden="true" />
            Photo ready
          </Button>
        </div>
      </div>
    );
  }

  /* ---------- live camera ---------- */
  return (
    <div className="space-y-4">
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border bg-primary/90">
        {live ? (
          <video
            ref={videoRef}
            playsInline
            muted
            aria-label="Rear camera preview"
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center px-6 text-center">
            <div className="space-y-3 text-white">
              <Camera className="mx-auto size-10" aria-hidden="true" />
              <p className="text-sm font-medium text-white/80">
                Open the rear camera to record the physical evidence.
              </p>
            </div>
          </div>
        )}

        {/* framing overlay */}
        <div className="pointer-events-none absolute inset-6 rounded-2xl border-2 border-dashed border-white/70" />
        <p className="pointer-events-none absolute inset-x-4 top-4 rounded-xl glass-dark px-3 py-2 text-center text-xs font-semibold text-white">
          Fit scale, crop &amp; grade card inside frame
        </p>
      </div>

      {error ? (
        <div className="flex gap-3 rounded-2xl border border-destructive/30 bg-danger-surface p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-destructive">
              {error === "permission"
                ? "Camera permission was denied."
                : error === "process"
                  ? "That photo couldn't be processed."
                  : "No camera is available on this device."}
            </p>
            <p className="mt-1 text-muted-foreground">
              {error === "permission"
                ? "Allow camera access in your browser settings, or choose a photo from the device instead."
                : "You can pick the evidence photo from your device gallery instead."}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {live ? (
          <Button
            type="button"
            size="lg"
            onClick={() => void shoot()}
            disabled={busy}
            className="h-16 rounded-2xl text-base sm:col-span-2"
          >
            {busy ? (
              <Loader2 className="size-6 animate-spin" aria-hidden="true" />
            ) : (
              <Camera className="size-6" aria-hidden="true" />
            )}
            {busy ? "Processing photo…" : "Capture evidence"}
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            onClick={() => void startCamera()}
            className="h-16 rounded-2xl text-base"
          >
            <Camera className="size-6" aria-hidden="true" />
            Open camera
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => fileRef.current?.click()}
          className="h-16 rounded-2xl text-base"
        >
          Use device photo
        </Button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-label="Choose audit photo"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void fromFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
