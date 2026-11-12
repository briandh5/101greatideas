import { Pointer } from "lucide-react";

/**
 * Manita que hace "tap" para indicar dónde tocar. Se repite cada 3 s y arranca
 * después de `retraso` ms. Va encima del elemento sin bloquear los clicks.
 */
export default function Tap({ retraso = 0, className = "" }: { retraso?: number; className?: string }) {
  return (
    <span aria-hidden className={`tap ${className}`} style={{ ["--tap-retraso" as string]: `${retraso}ms` }}>
      <span className="tap-onda" />
      <Pointer className="tap-mano" size={34} strokeWidth={1.75} />
    </span>
  );
}
