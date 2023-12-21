# urql-exchange-async-headers

[![test](https://github.com/acro5piano/urql-exchange-async-headers/actions/workflows/test.yml/badge.svg)](https://github.com/acro5piano/urql-exchange-async-headers/actions/workflows/test.yml)
![npm (tag)](https://img.shields.io/npm/v/urql-exchange-async-headers/latest)

A thin urql exchange which adds headers from promise value, using `mapExchange` from the official URQL package.

# Install

```
npm install --save urql-exchange-async-headers
```

Or if you use Yarn:

```
yarn add urql-exchange-async-headers
```

# Usage

You can need to add the `asyncHeaderExchange`, that this package exposes to your urql Client.

```typescript
import { createClient, cacheExchange, fetchExchange } from 'urql'
import { asyncHeaderExchange } from 'urql-exchange-async-headers'

const urqlClient = createClient({
  url: 'http://localhost:1234/graphql',
  exchanges: [
    cacheExchange,
    asyncHeaderExchange(() => {
      return Promise.resolve({
        foo: 'bar',
      })
    }),
    fetchExchange,
  ],
  // You can add synchronous headers along with async headers. They will be merged at runtime.
  fetchOptions: {
    headers: {
      foo: 'bar',
    },
  },
})
```

# Examples

### Add Firebase Auth header

```typescript
import { getAuth } from 'firebase/auth'
import { createClient, defaultExchanges } from 'urql'
import { asyncHeaderExchange } from 'urql-exchange-async-headers'

const urqlClient = createClient({
  url: 'http://localhost:1234/graphql',
  exchanges: [
    asyncHeaderExchange(async () => {
      const currentUser = getAuth().currentUser
      if (!currentUser) {
        return {}
      }
      const firebaseToken = await currentUser.getIdToken()
      return {
        authorization: `Bearer ${firebaseToken}`,
      }
    }),
    ...defaultExchanges,
  ],
})
```

### Add AppSync Auth header

```typescript
import { Auth } from 'aws-amplify'
import { createClient, defaultExchanges } from 'urql'
import { asyncHeaderExchange } from 'urql-exchange-async-headers'

const urqlClient = createClient({
  url: 'https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.ap-northeast-1.amazonaws.com/graphql',
  exchanges: [
    asyncHeaderExchange(async () => {
      const currentSession = await Auth.currentSession()
      return {
        authorization: currentSession.getIdToken().getJwtToken(),
        'x-amz-date': new Date().toISOString(),
        'x-amz-user-agent': 'URQL',
      }
    }),
    ...defaultExchanges,
  ],
})
```
