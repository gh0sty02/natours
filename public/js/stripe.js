/*eslint-disable*/
const stripe = Stripe(
  'pk_test_51IojHySC9ZmVvJfvRcHBjpFyZ4UoTR8pLi4rIE7fQhiwGlkAXwBLbtmEYRveIWY3TLKLdRmQqbMZfY9RkIeMJ5dJ00sieuRdop'
);
console.log(stripe);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
