# urql-exchange-async-headers

[![test](https://github.com/acro5piano/urql-exchange-async-headers/actions/workflows/test.yml/badge.svg)](https://github.com/acro5piano/knex-little-logger/actions/workflows/test.yml)
![npm (tag)](https://img.shields.io/npm/v/urql-exchange-async-headers/latest)

A urql exchange that adds the headers from promise value.

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
import { createClient, defaultExchanges } from 'urql'
import { asyncHeaderExchange } from 'urql-exchange-async-headers'

const urqlClient = createClient({
  url: 'http://localhost:1234/graphql',
  exchanges: [
    asyncHeaderExchange(() => {
      return Promise.resolve({
        foo: 'bar',
      })
    }),
    ...defaultExchanges,
  ],
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
      const session = await Auth.currentSession()
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
