import express from 'express'

import router from '../routes'

export function startServer() {
    const app = express()

    app.use(express.json())

    app.use(router)

    const serverPort = process.env.PORT || 3000

    app.listen(serverPort, () => {
		console.log(`Server started on ${serverPort} 🟢`)
	})

    return app
}