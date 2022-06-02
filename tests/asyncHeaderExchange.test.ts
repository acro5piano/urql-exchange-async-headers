import 'isomorphic-unfetch'

import test from 'ava'

import { asyncHeaderExchange } from '../src'
import { createClient, defaultExchanges } from 'urql'
import getPort from 'get-port'
import { createServer, IncomingMessage } from 'http'

function serve(port: number, onReq: (req: IncomingMessage) => void) {
  const server = createServer((req, res) => {
    res.end()
    onReq(req)
  })
  server.listen(port)
}

test('it adds header asynchronously', (t) => {
  return new Promise(async (resolve) => {
    const port = await getPort()
    serve(port, (req) => {
      t.is(req.headers['foo'], 'bar')
      resolve()
    })

    const client = createClient({
      url: `http://localhost:${port}/graphql`,
      exchanges: [
        asyncHeaderExchange(async () => {
          return {
            foo: 'bar',
          }
        }),
        ...defaultExchanges,
      ],
    })

    await client.query(`{ hello }`).toPromise()
  })
})

test('it does not add header asynchronously if fetchOptions function defined', (t) => {
  return new Promise(async (resolve) => {
    const port = await getPort()
    serve(port, (req) => {
      t.is(req.headers['foo'], undefined)
      t.is(req.headers['baz'], 'qux')
      resolve()
    })

    const client = createClient({
      url: `http://localhost:${port}/graphql`,
      fetchOptions() {
        return {
          headers: {
            baz: 'qux',
          },
        }
      },
      exchanges: [
        asyncHeaderExchange(async () => {
          return {
            foo: 'bar',
          }
        }),
        ...defaultExchanges,
      ],
    })

    await client.query(`{ hello }`).toPromise()
  })
})
