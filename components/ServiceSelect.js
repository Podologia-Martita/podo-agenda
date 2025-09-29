import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ServiceSelect({ professionalId, onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!professionalId) return;

    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('public.services') // esquema corregido
        .select('id, name')
        .eq('professional_id', professionalId)
        .order('name');

      console.log("Servicios:", data);
      console.log("Error:", error);

      if (error) setErrorMsg("Error al cargar servicios: " + error.message);
      else setServices(data || []);

      setLoading(false);
    };

    fetchServices();
  }, [professionalId]);

  if (loading) return <p>Cargando servicios...</p>;
  if (errorMsg) return <p>{errorMsg}</p>;
  if (services.length === 0) return <p>No hay servicios disponibles.</p>;

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option value="">Selecciona un servicio</option>
      {services.map(s => (
        <option key={s.id} value={s.name}>{s.name}</option>
      ))}
    </select>
  );
}