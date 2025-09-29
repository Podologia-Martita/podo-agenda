import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AvailableSlots({ professionalId, serviceName, date, onSelect }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!professionalId || !serviceName || !date) return;

    const fetchSlots = async () => {
      let { data, error } = await supabase
        .rpc('available_slots_service', { 
          p_professional_id: professionalId, 
          p_service_name: serviceName, 
          p_date: date 
        });
      if (!error) setSlots(data);
    };
    fetchSlots();
  }, [professionalId, serviceName, date]);

  return (
    <div>
      <h3>Horarios disponibles:</h3>
      {slots.length === 0 && <p>No hay horarios disponibles</p>}
      <ul>
        {slots.map((slot, i) => (
          <li key={i}>
            <button onClick={() => onSelect(slot.slot_start)}>
              {new Date(slot.slot_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
              {new Date(slot.slot_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
