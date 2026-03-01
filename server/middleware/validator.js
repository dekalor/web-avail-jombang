const { ZodError } = require("zod")

module.exports = (schema) => async (req, res, next) => {
  try {
    const result = await schema.parseAsync(req.body)

    req.validated = result
    next()
  }
  catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        message: err.issues?.[0]?.message || "Validation error",
        errors: err.issues
      })
    }

    // fallback for unexpected errors
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}
