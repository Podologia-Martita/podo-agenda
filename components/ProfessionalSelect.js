import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProfessionalSelect({ onSelect }) {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('id, name')
        .order('name');

      console.log("📌 Profesionales desde Supabase:", data);
      console.log("⚠️ Error:", error);

      if (error) {
        setErrorMsg("Error al cargar: " + error.message);
      } else {
        setProfessionals(data || []);
      }
      setLoading(false);
    };

    fetchProfessionals();
  }, []);

  if (loading) return <p>Cargando profesionales...</p>;
  if (errorMsg) return <p>{errorMsg}</p>;

  if (professionals.length === 0) {
    return <p>No hay profesionales registrados.</p>;
  }

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option value="">Selecciona un profesional</option>
      {professionals.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
