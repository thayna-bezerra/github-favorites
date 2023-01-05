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

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search('thayna-bezerra').then(user => console.log(user))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem
      ('@github-favorites')) || []
  }

  delete(user) { 
    const filteredEntries = this.entries //comparar se o objeto que está no 'entries' do método 'load' é o mesmo que está sendo recebido no parâmetro do 'user'
      .filter(entry => entry.login !== user.login)  //recriando o array e verificando o que tem dentro
     //se retornar falso vai eliminar do array //se true, coloca no array

    this.entries = filteredEntries //colocando a nova const no entries
    this.update() //depois que deletar.. atualizar aplicação
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody') 

    this.update()
  }

  update()   {
    this.removeAllTr()

    this.entries.forEach(user => {  //rodar uma função para cada um
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?")

        if(isOk){
          this.delete(user)
        }
      }


      this.tbody.append(row)
    })
  }

  createRow(){
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/thayna-bezerra.png" alt="imagem de thayna-bezerra">
        <a href="https://github.com/thayna-bezerra" target="_blank">
          <p>Thayna Bezerra</p>
          <span>thayna-bezerra</span>
        </a>
      </td>
      <td class="repositories">
        76
      </td>
      <td class="followers">
        9598
      </td>
      <td>
        <button class="remove">&times;</button>
      </td>
    `

    return tr
  }

  removeAllTr(){
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }


}