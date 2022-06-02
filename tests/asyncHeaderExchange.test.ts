import 'isomorphic-unfetch'

import test from 'ava'

import { asyncHeaderExchange } from '../src'
import { createClient, defaultExchanges } from 'urql'
import getPort from 'get-port'
import { createServer } from 'http'

test('it adds header asynchronously', (t) => {
  return new Promise(async (resolve) => {
    const port = await getPort()
    const server = createServer((req, res) => {
      res.end()
      t.is(req.headers['hoge'], 'fuga')
      resolve()
    })
    server.listen(port)

    const client = createClient({
      url: `http://localhost:${port}/graphql`,
      exchanges: [
        asyncHeaderExchange(async () => {
          return {
            hoge: 'fuga',
          }
        }),
        ...defaultExchanges,
      ],
    })

    await client.query(`{hello}`).toPromise()
  })
})
