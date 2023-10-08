import { Exchange, mapExchange, Operation, makeOperation } from 'urql'

type GetHeaders = (operation: Operation) => Promise<Record<string, string>>

/**
 * asyncHeaderExchange - A urql exchange that adds the headers from promise value.
 *
 * @param getHeaders {GetHeaders} - A function that returns a promise that resolves to a headers object.
 */
export const asyncHeaderExchange = (getHeaders: GetHeaders): Exchange =>
  mapExchange({
    async onOperation(operation) {
      if (typeof operation.context.fetchOptions === 'function') {
        operation.context.fetchOptions = operation.context.fetchOptions()
      }
      if (!operation.context.fetchOptions) {
        operation.context.fetchOptions = {
          headers: {},
        }
      }
      const headers = await getHeaders(operation)
      return makeOperation(operation.kind, operation, {
        ...operation.context,
        fetchOptions: {
          ...operation.context.fetchOptions,
          headers: {
            ...operation.context.fetchOptions.headers,
            ...headers,
          },
        },
      })
    },
  })
