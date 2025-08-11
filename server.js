

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './configs/mongodb.js' 
import contactRoutes from './routes/contactRoutes.js'

const app = express()

// Connect to services
await connectDB()
  
const allowedOrigins = [ 
  'http://localhost:5173', 
  'https://tranquil-sunburst-bd42dd.netlify.app'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))



app.use(cookieParser())
app.use(express.json())

// Routes
app.get('/', (req, res) => res.send('API Working'))
app.use("/api/contact", contactRoutes);

 
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
}) 
