import { NextResponse } from 'next/server';

const NOWPAYMENTS_API_KEY = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

export async function POST(request: Request) {
  try {
    const { amount, currency } = await request.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
      method: 'POST',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: 'usd',
        pay_currency: currency,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-webhook`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    const data = await response.json();

    return NextResponse.json({
      paymentId: data.payment_id,
      paymentAddress: data.pay_address,
      payAmount: data.pay_amount,
      payCurrency: data.pay_currency,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
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