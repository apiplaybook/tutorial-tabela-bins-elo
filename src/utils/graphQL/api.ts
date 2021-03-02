import fetch from 'node-fetch'

export const api = async ({
  query,
  variables
}: { 
  query: string,
  variables: Record<string, unknown>
}) => {
  const response = await fetch('https://hml-api.elo.com.br/graphql', {
    method: 'POST',
    headers: {
      'access_token': process.env.SECRET as string,
      'Content-Type': 'application/json',
      'client_id': process.env.CLIENT_ID as string
    },
    body: JSON.stringify({
      query,
      variables
    })
  })

  return response
}