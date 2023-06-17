import { response } from 'express';
import { HOST, PAYPAL_API, PAYPAL_API_CLIENT, PAYPAL_API_SECRET } from '../config.js'
import axios from 'axios'

export const createOrder = async (req, res) => {
    const order = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: "100.00",
                }
            }
        ],
        application_context: {
            brand_name: "Mi Tienda",
            landing_page: "NO_PREFERENCE",
            user_action: "PAY_NOW",
            return_url: '${HOST}/capture-order',
            cancel_url: '${HOST}/cancel-order',
        }
    }
    const params = new URLSearchParams();
    params.append('grand_type', 'client_credentials');

    const { data: { access_token } } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
        auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET
        }
    })

    axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })
    console.log(response.data)
}
export const captureOrder = (req, res) => res.send('CaptureOrder created');
export const cancelPayment = (req, res) => res.send('CancelPayment created');
