import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProfessionalSelect({ onSelect }) {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      let { data, error } = await supabase
        .from('professionals')
        .select('id, name')
        .order('name');
      if (!error) setProfessionals(data);
    };
    fetchProfessionals();
  }, []);

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option value="">Selecciona un profesional</option>
      {professionals.map(p => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  );
}