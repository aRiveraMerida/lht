# Variables de entorno necesarias en Vercel

| Variable | Origen | Cómo obtenerla |
|----------|--------|---------------|
| RESEND_API_KEY | Automática | Se configura al instalar Resend desde Vercel Marketplace |
| RESEND_AUDIENCE_ID | Manual | Resend → Audiences → Newsletter LHT → copiar ID |
| BLOB_READ_WRITE_TOKEN | Automática | Se configura al crear Blob Store en Vercel |
| UPLOAD_SECRET | Manual | Generar con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
