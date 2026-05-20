import { redirect } from 'next/navigation';

// La tienda se renombró de /drop a /tienda. Mantenemos /drop como redirección
// permanente para no romper enlaces antiguos ni la PDP.
export default function DropRedirect() {
  redirect('/tienda');
}
