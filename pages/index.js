import { useState } from 'react';
import ProfessionalSelect from '../components/ProfessionalSelect';
import ServiceSelect from '../components/ServiceSelect';
import AvailableSlots from '../components/AvailableSlots';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [professionalId, setProfessionalId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [clientName, setClientName] = useState('');

  const bookSlot = async () => {
    if (!professionalId || !serviceName || !selectedSlot || !clientName)
      return alert('Completa todos los campos');

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        professional_id: professionalId,
        service: serviceName,
        client_name: clientName,
        time: selectedSlot
      }]);

    if (error) alert('Error al reservar: ' + error.message);
    else alert('Reserva realizada con éxito');
  };

  return (
    <div>
      <h1>Reserva tu cita</h1>

      <ProfessionalSelect onSelect={setProfessionalId} />
      {professionalId && <ServiceSelect professionalId={professionalId} onSelect={setServiceName} />}

      {professionalId && serviceName && (
        <>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          <AvailableSlots 
            professionalId={professionalId} 
            serviceName={serviceName} 
            date={selectedDate} 
            onSelect={setSelectedSlot} 
          />
        </>
      )}

      {selectedSlot && (
        <div>
          <input 
            type="text" 
            placeholder="Tu nombre" 
            value={clientName} 
            onChange={e => setClientName(e.target.value)} 
          />
          <button onClick={bookSlot}>Reservar</button>
        </div>
      )}
    </div>
  );
}
