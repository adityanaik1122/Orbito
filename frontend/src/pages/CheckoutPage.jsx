import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, CheckCircle, AlertCircle, ArrowLeft, MapPin, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// ── Inner form — must be inside <Elements> ───────────────────────────────────
function PaymentForm({ booking, tour, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    setErrorMsg(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMsg(error.message);
      setPaying(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMsg && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || paying}
        className="w-full py-6 text-base font-semibold"
      >
        {paying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing payment…
          </>
        ) : (
          `Pay ${booking?.currency || 'GBP'} ${Number(booking?.total_amount || 0).toFixed(2)}`
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Secured by Stripe · Your card details are never stored by Orbito
      </p>
    </form>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ booking, navigate }) {
  return (
    <div className="text-center py-12 space-y-4">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h2 className="text-2xl font-bold text-gray-900">Payment confirmed!</h2>
      <p className="text-gray-600">
        Your booking reference is{' '}
        <span className="font-mono font-semibold text-primary">
          {booking?.booking_reference || booking?.id}
        </span>
      </p>
      <p className="text-gray-500 text-sm">
        A confirmation email has been sent to{' '}
        <strong>{booking?.customer_email}</strong>
      </p>
      <div className="flex gap-3 justify-center pt-4">
        <Button variant="outline" onClick={() => navigate('/bookings')}>
          View My Bookings
        </Button>
        <Button onClick={() => navigate('/plan')}>Plan Another Trip</Button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clientSecret, booking, tour } = location.state || {};
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (!clientSecret || !booking) {
      navigate('/tours');
    }
  }, [clientSecret, booking, navigate]);

  if (!clientSecret || !booking) return null;

  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0B3D91',
        borderRadius: '8px',
      },
    },
  };

  // Friendly date
  const tourDate = booking.customer_contact?.preferred_date
    ? new Date(booking.customer_contact.preferred_date).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back */}
        {!succeeded && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* ── Order summary (left) ── */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg">Order summary</h3>

              {/* Tour image */}
              {(tour?.main_image || tour?.image || tour?.images?.[0]) && (
                <img
                  src={tour.main_image || tour.image || tour.images[0]}
                  alt={tour.title}
                  className="w-full h-36 object-cover rounded-lg"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}

              <div className="space-y-2">
                <p className="font-semibold text-gray-900 leading-snug">
                  {tour?.title || 'Tour'}
                </p>

                {(tour?.city || tour?.destination) && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {tour.city || tour.destination}
                  </div>
                )}

                {tourDate && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {tourDate}
                  </div>
                )}

                {tour?.duration_minutes && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.round(tour.duration_minutes / 60)} hrs
                  </div>
                )}
              </div>

              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>
                    {booking.num_people || 1} ×{' '}
                    {(booking.currency || 'GBP')}{' '}
                    {Number(tour?.price_amount || 0).toFixed(2)}
                  </span>
                  <span>
                    {(booking.currency || 'GBP')}{' '}
                    {Number(booking.total_amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 pt-1">
                  <span>Total</span>
                  <span>
                    {booking.currency || 'GBP'}{' '}
                    {Number(booking.total_amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center">
              Free cancellation up to 24 hours before the tour
            </div>
          </div>

          {/* ── Payment panel (right) ── */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow p-6">
              {succeeded ? (
                <SuccessScreen booking={booking} navigate={navigate} />
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Complete your payment
                  </h2>
                  <Elements stripe={stripePromise} options={elementsOptions}>
                    <PaymentForm
                      booking={booking}
                      tour={tour}
                      onSuccess={() => setSucceeded(true)}
                    />
                  </Elements>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
