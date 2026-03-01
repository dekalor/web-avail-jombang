const { z } = require("zod")

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
    courier_code: z.string(),
    cost: z.coerce.number().min(0, "Ongkir tidak valid"),
  }),

  payment_method: z.enum(
    ["cod", "qris", "bank"],
    {
      errorMap: () => ({
        message: "Metode pembayaran tidak valid"
      })
    }
  ),
  payment_method_id: z.coerce.number().optional(),
  payment_proof_data: z.string().optional(),
  guest_checkout_token: z.string().min(20, "Guest token tidak valid"),
  challenge_id: z.string().min(10, "Challenge token tidak valid"),

  items: z.array(
    z.object({
      product_id: z.coerce.number(),
      qty: z.coerce.number().min(1, "Quantity tidak valid"),
      price: z.coerce.number().min(0)
    })
  ).min(1, "Keranjang kosong"),
  
  subtotal: z.coerce.number(),
})

module.exports = orderSchema
