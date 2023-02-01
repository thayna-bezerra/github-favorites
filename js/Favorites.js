import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || []
  }

  save() {
    localStorage.setItem('@github-favorites', JSON.stringify(this.entries)) //transforma o array cheio de objetos em formato de json
  }

  async add(username){
    try{
  
      const userExists = this.entries.find(entry => entry.login === username) //verificar se a entrada ja existe

      if(userExists) {
        throw new Error ('Usuario ja cadastrado')
      }

      const user = await GithubUser.search(username) //esperar uma promessa
  
      if(user.login === undefined) {
        throw new Error('Usuario não encontrado!')
      } 


      this.entries = [user, ...this.entries] //espalhando 
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) { 
    const filteredEntries = this.entries //comparar se o objeto que está no 'entries' do método 'load' é o mesmo que está sendo recebido no parâmetro do 'user'
      .filter(entry => entry.login !== user.login)  //recriando o array e verificando o que tem dentro
     //se retornar falso vai eliminar do array //se true, coloca no array

    this.entries = filteredEntries //colocando a nova const no entries
    this.update() //depois que deletar.. atualizar aplicação
    this.save()
    
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody') 

    this.update()
    this.onadd()
    
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')

    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  update()   {
    this.removeAllTr()

    this.entries.forEach(user => {  //rodar uma função para cada um
      const row = this.createRow()
      
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
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

    if(this.entries.length === 0){
      console.log("não tem nada aqui", this.entries)
    }
  }

  createRow(){
    const tr = document.createElement('tr') //vai criar linha

    tr.innerHTML = `
    <td class="user">
      <img src="" alt="">
      <a href="" target="_blank">
        <p></p>
        <span></span>
      </a>
    </td>
    <td class="repositories">
    </td>
    <td class="followers">
    </td>
    <td>
      <button class="remove">Remove</button>
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