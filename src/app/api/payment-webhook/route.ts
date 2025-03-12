import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Verify the payment status
    if (payload.payment_status !== 'finished') {
      return NextResponse.json({ status: 'pending' });
    }

    // Update user's subscription status in the database
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: payload.order_id, // Assuming we're using user_id as order_id
        status: 'active',
        plan_type: 'premium',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        payment_id: payload.payment_id,
        amount: payload.pay_amount,
        currency: payload.pay_currency,
      });

    if (error) {
      console.error('Error updating subscription:', error);
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 