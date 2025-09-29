import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ServiceSelect({ professionalId, onSelect }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!professionalId) return;

    const fetchServices = async () => {
      let { data, error } = await supabase
        .from('services')
        .select('id, name')
        .eq('professional_id', professionalId);
      if (!error) setServices(data);
    };
    fetchServices();
  }, [professionalId]);

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option value="">Selecciona un servicio</option>
      {services.map(s => (
        <option key={s.id} value={s.name}>{s.name}</option>
      ))}
    </select>
  );
}
