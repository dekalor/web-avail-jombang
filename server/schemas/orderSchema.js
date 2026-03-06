const { z } = require("zod")
const orderRepository = require("../repositories/orderRepository")

const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    phone: z.string().min(8, "Nomor HP tidak valid"),
  }),

  shipping: z.object({
    province_id: z.coerce.number({invalid_type_error: "Provinsi tidak valid"}),
    city_id: z.coerce.number({invalid_type_error: "Kota tidak valid"}),
    district_id: z.coerce.number({invalid_type_error: "Kecamatan tidak valid"}),
    address: z.string().min(1, "Alamat wajib diisi"),
    postal_code: z.string().min(3, "Kode pos tidak valid"),
    notes: z.string().optional(),
    courier_code: z.string().optional(),
    cost: z.coerce.number().min(0, "Ongkir tidak valid"),
  }),

  payment_method: z.string().min(1, "Metode pembayaran wajib diisi"),
  payment_method_id: z.coerce.number().optional(),
  payment_proof_data: z.string().optional(),
  guest_checkout_token: z.string().min(20, "Guest token tidak valid"),
  challenge_id: z.string().min(10, "Challenge token tidak valid"),

  items: z.array(
    z.object({
      product_id: z.coerce.number(),
      qty: z.coerce.number().min(1, "Quantity tidak valid"),
      product_unit_id: z.coerce.number(),
      price: z.coerce.number().min(0).optional()
    })
  ).min(1, "Keranjang kosong"),
  
  subtotal: z.coerce.number(),
}).superRefine(async (data, ctx) => {
  const paymentMethodType = data.payment_method?.trim()
  if (!paymentMethodType) {
    return
  }

  if (data.payment_method_id) {
    const selectedMethod = await orderRepository.findPaymentMethodById(data.payment_method_id)

    if (!selectedMethod || !selectedMethod.active) {
      ctx.addIssue({
        code: 'custom',
        message: "Metode pembayaran tidak ditemukan",
        path: ['payment_method_id'],
      })
    } else if (selectedMethod.type !== paymentMethodType) {
      ctx.addIssue({
        code: 'custom',
        message: "Metode pembayaran dan ID pembayaran tidak sesuai",
        path: ['payment_method_id'],
      })
    }
  } else {
    const paymentMethod = await orderRepository.findPaymentMethod({
      type: paymentMethodType,
      active: true,
    })

    if (!paymentMethod) {
      ctx.addIssue({
        code: 'custom',
        message: "Metode pembayaran tidak valid",
        path: ['payment_method'],
      })
    }
  }

  if (data.payment_method !== 'cod' && !data.shipping.courier_code?.trim()) {
    ctx.addIssue({
      code: 'custom',
      message: 'Kurir wajib dipilih untuk metode pembayaran ini',
      path: ['shipping', 'courier_code'],
    });
  }
})

module.exports = orderSchema
