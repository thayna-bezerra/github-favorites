export class GithubUser {
  static search(username){
    const endpoint = `https://api.github.com/users/${username}`

    //com o fetch é preciso tornar em JSON pois é retornado dados em string
    return fetch(endpoint)
    .then(data => data.json())
    .then(
      ({login, name, public_repos, followers}) => (
        {
          login,
          name,
          public_repos,
          followers
        })
    )
  }
}
