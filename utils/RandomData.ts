import { Users } from './Users'

export async function getUserData() {
  let i = 0

  do {
    try {
      const response = await fetch('https://randomuser.me/api/')
      const data = await response.json()
      Users.randomUserFirstName = data.results[0].name.first
      Users.randomUserLastName = data.results[0].name.last

      if (Users.randomUserFirstName !== null && Users.randomUserLastName !== null) {
        break
      }
    } catch (error) {
      console.error('Error fetching user data:')
      // Check if it's a socket connection timeout and log a specific message
      if (error.code === 'ERR_SOCKET_CONNECTION_TIMEOUT') {
        console.error('Socket connection timeout. Retrying...')
      }
    }
    i++
  } while (i < 10)
}
