import express from "express"
import next from "next"
import { createProxyMiddleware } from "http-proxy-middleware";

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const apiPaths = {
    '/api': {
        target: 'https://systempcs.herokuapp.com',
        pathRewrite: {
            '^/api': '/api'
        },
        changeOrigin: true
    }
}

const isDevelopment = process.env.NODE_ENV !== 'production'

app.prepare().then(() => {
    const server = express()

    if (isDevelopment) {
        server.use('/api', createProxyMiddleware(apiPaths['/api']));
    }

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, () => {
        console.info(`Ready on port ${port}`);
    });
}).catch((err) => {
    console.log('Error:::::', err)
})

export default {}