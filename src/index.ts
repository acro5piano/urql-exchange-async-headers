import { Exchange } from 'urql'
import { fromPromise, map, mergeMap, pipe } from 'wonka'

type GetHeaders = () => Promise<Record<string, string>>

export const asyncHeaderExchange =
  (getHeaders: GetHeaders): Exchange =>
  ({ forward }) =>
  (operations$) =>
    pipe(
      operations$,
      mergeMap((operation) => {
        return pipe(
          fromPromise(getHeaders()),
          map((headers) => {
            if (!operation.context.fetchOptions) {
              operation.context.fetchOptions = {
                headers: {},
              }
            }
            if (typeof operation.context.fetchOptions === 'function') {
              console.warn(
                '[urql-exchange-async-headers] WARNING: no headers are attached because `operation.context.fetchOptions` is a function',
              )
              return operation
            }
            Object.assign(operation.context.fetchOptions.headers!, {
              ...operation.context.fetchOptions.headers!,
              ...headers,
            })
            return operation
          }),
        )
      }),
      forward,
    )
