import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51PqnMzCMCpxFz40M8d2cMHVls4DrIYDZlPGAXJ6cga9bFDFftUhstIqCswWx6J9wZtAAgt25OtUVlsyT4AQ4gfgr00bTgd7zr6', {
    apiVersion: '2024-11-20.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { amount, currency, first_name, last_name, email, address, phone } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
        metadata: {
            first_name,
            last_name,
            email,
            address,
            phone,
        },
    });

    res.status(200).json({ paymentIntent });
}
