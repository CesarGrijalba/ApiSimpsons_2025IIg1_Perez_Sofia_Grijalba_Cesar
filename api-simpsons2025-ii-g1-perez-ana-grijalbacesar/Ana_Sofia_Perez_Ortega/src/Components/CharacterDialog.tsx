// src/Components/CharacterDialog.tsx
import { useEffect, useState } from "react";
import { getCharacter, randomQuoteByName, img, Character } from "../services/simpsonApi";

export default function CharacterDialog({
  id,
  onClose,
}: { id: number | null; onClose: () => void }) {
  const [data, setData] = useState<Character | null>(null);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const c = await getCharacter(id);
      setData(c);
      const local =
        Array.isArray(c.phrases) && c.phrases.length
          ? c.phrases[Math.floor(Math.random() * c.phrases.length)]
          : null;
      if (local) setQuote(local);
      else {
        const q = await randomQuoteByName(c.name);
        if (q) setQuote(q);
      }
    })();
  }, [id]);

  if (!id || !data) return null;

  return (
    <div
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
               display:"grid", placeItems:"center", zIndex:9998 }}
    >
      <div onClick={(e)=>e.stopPropagation()}
           style={{ background:"#fff", width:"min(720px,92vw)",
                    borderRadius:16, padding:20 }}>
        <div style={{ display:"flex", gap:16 }}>
          <img src={img(data.portrait_path)} alt={data.name}
               style={{ width:160, height:160, objectFit:"cover", borderRadius:12 }}/>
          <div style={{ flex:1 }}>
            <h2 style={{ margin:"4px 0 6px" }}>{data.name}</h2>
            <p style={{ margin:0, opacity:.8 }}>
              {(data.occupation||"—")} · {(data.gender||"—")} · {(data.status||"—")}
            </p>
            {data.age ? <p style={{ margin:"6px 0 0" }}>Edad: {data.age}</p> : null}
            <hr style={{ margin:"12px 0" }}/>
            <em>Frase célebre:</em>
            <blockquote style={{ marginTop:6 }}>{quote || "…"}</blockquote>
          </div>
        </div>
        <div style={{ textAlign:"right", marginTop:12 }}>
          <button onClick={onClose} style={{ padding:"8px 12px", borderRadius:10 }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
