import 'isomorphic-unfetch'

import test from 'ava'

import { asyncHeaderExchange } from '../src'
import { createClient, cacheExchange, fetchExchange } from 'urql'
import getPort from 'get-port'
import { createServer, IncomingMessage } from 'http'

function serve(port: number, onReq: (req: IncomingMessage) => void) {
  const server = createServer((req, res) => {
    console.log('requested!')
    res.end()
    onReq(req)
  })
  server.listen(port)
}

const exchanges = [
  cacheExchange,
  asyncHeaderExchange(async () => {
    return {
      foo: 'bar',
    }
  }),
  fetchExchange,
]

test('it adds header asynchronously', (t) => {
  return new Promise(async (resolve) => {
    const port = await getPort()
    serve(port, (req) => {
      t.is(req.headers['foo'], 'bar')
      resolve()
    })

    const client = createClient({
      url: `http://localhost:${port}/graphql`,
      exchanges,
    })

    await client.query(`{ hello }`, {}).toPromise()
  })
})

test('it adds header asynchronously if fetchOptions function defined', (t) => {
  return new Promise(async (resolve) => {
    const port = await getPort()
    serve(port, (req) => {
      t.is(req.headers['foo'], 'bar')
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
      exchanges,
    })

    await client.query(`{ hello }`, {}).toPromise()
  })
})

test('it merges existing headers', (t) => {
  return new Promise(async (resolve) => {
    const port = await getPort()
    serve(port, (req) => {
      t.is(req.headers['foo'], 'bar')
      t.is(req.headers['baz'], 'qux')
      resolve()
    })

    const client = createClient({
      url: `http://localhost:${port}/graphql`,
      fetchOptions: {
        headers: {
          baz: 'qux',
        },
      },
      exchanges,
    })

    await client.query(`{ hello }`, {}).toPromise()
  })
})
