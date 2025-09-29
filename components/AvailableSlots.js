import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AvailableSlots({ professionalId, serviceName, date, onSelect }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!professionalId || !serviceName || !date) return;

    const fetchSlots = async () => {
      // Obtener la duración del servicio
      const { data: servicesData, error: serviceError } = await supabase
        .from('public.services')
        .select('duration_minutes')
        .eq('professional_id', professionalId)
        .eq('name', serviceName)
        .single();

      if (serviceError || !servicesData) {
        console.log("Error al obtener duración:", serviceError);
        setSlots([]);
        setLoading(false);
        return;
      }

      const serviceDuration = servicesData.duration_minutes;
      const startHour = 10;
      const endHour = 18;
      const bookedSlots = [];

      // Traer reservas existentes
      const { data: bookingsData } = await supabase
        .from('public.bookings')
        .select('time')
        .eq('professional_id', professionalId);

      if (bookingsData) {
        bookingsData.forEach(b => bookedSlots.push(new Date(b.time).getHours()));
      }

      const available = [];
      for (let hour = startHour; hour < endHour; hour++) {
        if (!bookedSlots.includes(hour)) {
          available.push(`${hour.toString().padStart(2,'0')}:00`);
        }
      }

      setSlots(available);
      setLoading(false);
    };

    fetchSlots();
  }, [professionalId, serviceName, date]);

  if (loading) return <p>Cargando horarios...</p>;
  if (slots.length === 0) return <p>No hay horarios disponibles.</p>;

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option value="">Selecciona un horario</option>
      {slots.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}