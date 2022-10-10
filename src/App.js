import { useEffect, useState } from 'react';
import './App.css';
import axios from './services/axios';

function App() {
  const inputNome = document.querySelector('#input_nome');
  const inputIdade = document.querySelector('#input_idade');
  const inputTelefone = document.querySelector('#input_telefone');
  const inputPesquisa = document.querySelector('#input_pesquisa');
  const listview = document.querySelector('#lista-contatos');

  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState({
    nome: '',
    idade: '',
    numero: ''
  });
  const [selectedContact, setSelectedContact] = useState([]);
  const [research, setResearch] = useState('')

  const listContacts = async()=>{
    try {
      const getLista = await axios.get('/contact').then((response)=>{
        setContacts(response.data);

        if(contacts.length > 0) {
          listview.innerHTML = ''
          for(let contact of contacts) {
            
              const option = document.createElement('option');
              option.textContent = `Nome: ${contact.nome} || Numero: ${contact.numero}`;
              option.value = contact.id
              option.onclick = () => {setSelectedContact(contact);}
              listview.appendChild(option);
            }
          }
          return ;
        });
      } catch (error) {
        console.log(error.message);
      }
    }

    const addContact = async()=>{
    try {
      const addContact = await axios.post('/contact', currentContact);

      inputNome.value = '';
      inputIdade.value = '';
      inputTelefone.value = '';

      setCurrentContact({
        nome: '',
        idade: '',
        numero: ''
      })

      return window.alert("Contato adicionado!");;



    } catch (error) {
      console.log(error.message);
    }

  }

  const deleteContact = async()=>{
    try {
      const deletedContact = await axios.delete(`/contact/${+selectedContact.id}`);
      setSelectedContact({});
      window.alert("Contato excluido!");
      return
    } catch (error) {
      return console.log(error.message);
    }
  }

  const selectContactEdit = async()=>{
    inputNome.value = selectedContact.nome;
    inputIdade.value = selectedContact.idade;
    inputTelefone.value = selectedContact.numero;
    setCurrentContact(selectedContact);
  }

  const updateContact = async()=>{
    try {
      console.log(currentContact);
      const updatedContact = await axios.put(`/contact/${+selectedContact.id}`, currentContact);
      inputNome.value = '';
      inputIdade.value = '';
      inputTelefone.value = '';

      setCurrentContact({
        nome: '',
        idade: '',
        numero: ''
      })
      return window.alert("Contato editado!");
      
    } catch (error) {
      return console.log(error.message);
    }
  }

  const handleResearch = async ()=>{
    try {
      const contactsFiltered = []
      contacts.forEach((contact)=>{
        if(contact.nome == research || contact.numero == research){
          contactsFiltered.push(contact);
        }
      })
      
      listview.innerHTML = ''

      contactsFiltered.forEach((contact)=>{
        const option = document.createElement('option');
              option.textContent = `Nome: ${contact.nome} || Numero: ${contact.numero}`;
              option.value = contact.id
              option.onclick = () => {setSelectedContact(contact);}
              listview.appendChild(option);
      })
  

      return 
      
    } catch (error) {
      return console.log(error.message);
    }
  }


  return (
    <div className="App">
      <header>
        <h1>Agenda Telefônica </h1>
        <span>Desenvolvido por Henrique Araujo</span>
      </header>
      <hr/>
      <div className="container">
        <div className="secao-cadastro">
          <form action="">
                <label >
                    Nome:<input type="text" id="input_nome" onChange={
                      (e)=>{
                          e.preventDefault();
                          setCurrentContact({...currentContact, nome: e.target.value})
                        }
    }/>
                </label>
                <label>
                    Idade: <input type="text" id="input_idade" onChange={
                      (e)=>{
                          e.preventDefault();
                          setCurrentContact({...currentContact, idade: +e.target.value})
                        }}/>
                </label>
                <label>
                       Telefone: <input type="text" id="input_telefone" className="input-telefone"
                       onChange={
                        (e)=>{
                            e.preventDefault();
                            setCurrentContact({...currentContact, numero: e.target.value})
                          }}/>
                </label>
                <div className="btns">
                    <button type='button' id="btn-cadastrar" onClick={()=>{addContact()}}>Cadastrar</button>
                    <button type='button' id="btn-alterar" onClick={()=>updateContact()}>Alterar</button>
                </div>
                
            </form>
        </div>
        <div className="secao-pesquisa">
                <label>
                    Nome ou numero:
                    <input type="text" id="input-pesquisa" onChange={
                        (e)=>{
                            e.preventDefault();
                            setResearch(e.target.value);
                          }
                        }
                    />
                    <button id="btn-pesquisar" onClick={()=>handleResearch()}>Pesquisar</button>
                    <button id="btn-mostrar" onClick={()=>listContacts()}>Mostrar todos</button>
                </label>
                                    <br/>
                <select name="lista-contatos" id="lista-contatos" size="10">
                </select>
                <br/>
                <div className="btn-edita-apaga">
                    <button id="btn-editar" onClick={()=>selectContactEdit()}>Editar contato</button>
                    <button id="btn-apagar" onClick={()=>deleteContact()}>Apagar contato</button>
                </div>
        </div>
      </div>
    </div>
  );
}

export default App;
