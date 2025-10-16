// src/Pages/CharacterDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Helpers mínimos (usa los mismos que ya usas en otras páginas si los tienes)
const BASE = "https://thesimpsonsapi.com/api";
const img = (p, size = 500) =>
  p ? `https://cdn.thesimpsonsapi.com/${size}${p}` : "/placeholder.jpg";

export default function CharacterDetails() {
  const { id } = useParams();         // <- lee /details/:id
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        // 1) Traer el personaje por id
        const r = await fetch(`${BASE}/characters/${id}`);
        if (!r.ok) throw new Error("No se pudo cargar el personaje");
        const c = await r.json();
        if (!alive) return;
        setData(c);

        // 2) Frase: si la API trae phrases[], uso una aleatoria. Si no, pido a la quote API.
        const local =
          Array.isArray(c.phrases) && c.phrases.length
            ? c.phrases[Math.floor(Math.random() * c.phrases.length)]
            : null;

        if (local) {
          setQuote(local);
        } else {
          try {
            const q = await fetch(
              `https://thesimpsonsquoteapi.glitch.me/quotes?character=${encodeURIComponent(
                c.name
              )}`
            );
            const arr = await q.json();
            if (Array.isArray(arr) && arr[0]?.quote) setQuote(arr[0].quote);
          } catch {
            /* sin frase, no pasa nada */
          }
        }
      } catch (e) {
        setErr(e.message || "Error al cargar");
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) return <main style={{ padding: 16 }}>Cargando…</main>;
  if (err)     return <main style={{ padding: 16 }}>Error: {err}</main>;
  if (!data)   return <main style={{ padding: 16 }}>No se encontró el personaje.</main>;

  // "Dirección": si la API no trae campo de dirección, muestro ocupación como subtítulo
  // y hago fallback a "Springfield" (igual que en tu CharCard).
  const direccion = data.address || data.residence || data.location || data.occupation || "Springfield";

  return (
    <main className="details-wrapper" style={{ padding: 16 }}>
      <h1 className="details-title" style={{ textAlign: "center", marginBottom: 24 }}>
        DETALLES DEL PERSONAJE
      </h1>

      <section
        className="details-content"
        style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 24, alignItems: "start", maxWidth: 980, margin: "0 auto" }}
      >
        {/* Cuadro de la izquierda (tu cuadrado amarillo) */}
        <div className="details-avatar"
             style={{ width: 120, height: 120, borderRadius: 16, border: "4px solid #000",
                      boxShadow: "0 6px 16px rgba(0,0,0,.2)", background: "#fff",
                      display: "grid", placeItems: "center" }}>
          <img
            src={img(data.portrait_path)}
            alt={data.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
          />
        </div>

        {/* Tarjeta blanca de Nombre / Frase / Dirección */}
        <div
          className="details-card"
          style={{
            background: "#fff", borderRadius: 16, padding: 20,
            boxShadow: "0 8px 18px rgba(0,0,0,.15)", border: "3px solid #F3CC00",
            maxWidth: 360
          }}
        >
          <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Nombre:</p>
          <p style={{ margin: "0 0 14px" }}>{data.name}</p>

          <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Frase:</p>
          <p style={{ margin: "0 0 14px", whiteSpace: "pre-wrap" }}>
            {quote || "—"}
          </p>

          <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Dirección:</p>
          <p style={{ margin: 0 }}>{direccion}</p>
        </div>
      </section>

      <div style={{ display: "grid", placeItems: "center", marginTop: 24 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 16px", borderRadius: 10, border: "none",
            background: "#F3CC00", cursor: "pointer", boxShadow: "0 6px 14px rgba(0,0,0,.2)"
          }}
        >
          ATRÁS
        </button>
      </div>
    </main>
  );
}
