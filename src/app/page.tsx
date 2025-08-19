import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to English login page by default
  redirect('/eng/home');
}
